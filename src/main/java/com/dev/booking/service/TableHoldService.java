package com.dev.booking.service;

import com.dev.booking.model.TableHold;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TableHoldService {

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private AvailabilityCacheService availabilityCacheService;

    @Value("${booking.hold.duration-minutes:5}")
    private long holdDurationMinutes;

    // Thread-safe fallback store when Redis is unavailable
    private final ConcurrentHashMap<String, TableHold> inMemoryHolds = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> inMemoryTokenMap = new ConcurrentHashMap<>();

    public String buildHoldKey(Long tableId, String date, String timeSlot) {
        return String.format("hold:table:%d:%s:%s", tableId, date, timeSlot);
    }

    public String buildTokenKey(String token) {
        return String.format("hold:token:%s", token);
    }

    /**
     * Atomically acquires a temporary hold on a table using Redis SET NX EX,
     * or fallback in-memory engine.
     */
    public Optional<TableHold> acquireHold(
            Long tableId,
            String date,
            String timeSlot,
            Integer guestCount,
            String sessionId,
            String customerName,
            Integer customTtlSeconds
    ) {
        String holdKey = buildHoldKey(tableId, date, timeSlot);
        long ttlSeconds = (customTtlSeconds != null && customTtlSeconds > 0)
                ? customTtlSeconds
                : (holdDurationMinutes * 60);

        String holdToken = "hld_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        long now = System.currentTimeMillis();
        long expiresAt = now + (ttlSeconds * 1000);

        TableHold hold = TableHold.builder()
                .tableId(tableId)
                .date(date)
                .timeSlot(timeSlot)
                .guestCount(guestCount)
                .holdToken(holdToken)
                .sessionId(sessionId)
                .customerName(customerName)
                .createdAt(now)
                .expiresAt(expiresAt)
                .build();

        // 1. Try Redis first
        if (redisTemplate != null) {
            try {
                Boolean acquired = redisTemplate.opsForValue().setIfAbsent(holdKey, hold, ttlSeconds, TimeUnit.SECONDS);

                if (Boolean.TRUE.equals(acquired)) {
                    redisTemplate.opsForValue().set(buildTokenKey(holdToken), holdKey, ttlSeconds, TimeUnit.SECONDS);
                    availabilityCacheService.evictAvailability(date, timeSlot);
                    log.info("Hold acquired in Redis for table {} on {} at {}", tableId, date, timeSlot);
                    return Optional.of(hold);
                }

                // Check if held by the same session (allow extension/refresh)
                Object currentHoldObj = redisTemplate.opsForValue().get(holdKey);
                if (currentHoldObj instanceof TableHold existingHold) {
                    if (existingHold.getSessionId().equals(sessionId)) {
                        redisTemplate.opsForValue().set(holdKey, hold, ttlSeconds, TimeUnit.SECONDS);
                        redisTemplate.opsForValue().set(buildTokenKey(holdToken), holdKey, ttlSeconds, TimeUnit.SECONDS);
                        availabilityCacheService.evictAvailability(date, timeSlot);
                        return Optional.of(hold);
                    }
                }

                log.warn("Table {} already held by another session for {} at {}", tableId, date, timeSlot);
                return Optional.empty();
            } catch (Exception e) {
                log.warn("Redis error on acquireHold, using in-memory engine fallback: {}", e.getMessage());
            }
        }

        // 2. In-Memory Atomic Fallback Engine
        synchronized (this) {
            TableHold existing = inMemoryHolds.get(holdKey);
            if (existing != null && now <= existing.getExpiresAt()) {
                if (existing.getSessionId().equals(sessionId)) {
                    inMemoryHolds.put(holdKey, hold);
                    inMemoryTokenMap.put(holdToken, holdKey);
                    availabilityCacheService.evictAvailability(date, timeSlot);
                    return Optional.of(hold);
                }
                return Optional.empty();
            }

            inMemoryHolds.put(holdKey, hold);
            inMemoryTokenMap.put(holdToken, holdKey);
            availabilityCacheService.evictAvailability(date, timeSlot);
            log.info("Hold acquired in In-Memory store for table {} on {} at {}", tableId, date, timeSlot);
            return Optional.of(hold);
        }
    }

    /**
     * Validates an active hold token, verifying session ownership and expiration.
     */
    public Optional<TableHold> validateHold(
            String holdToken,
            Long expectedTableId,
            String expectedDate,
            String expectedTimeSlot,
            String sessionId
    ) {
        if (holdToken == null || holdToken.isBlank()) {
            return Optional.empty();
        }

        // Try Redis first
        if (redisTemplate != null) {
            try {
                String tokenKey = buildTokenKey(holdToken);
                Object holdKeyObj = redisTemplate.opsForValue().get(tokenKey);
                if (holdKeyObj != null) {
                    String holdKey = holdKeyObj.toString();
                    Object holdObj = redisTemplate.opsForValue().get(holdKey);
                    if (holdObj instanceof TableHold hold) {
                        return checkHoldValidity(hold, expectedTableId, expectedDate, expectedTimeSlot, sessionId);
                    }
                }
            } catch (Exception e) {
                log.warn("Redis error on validateHold, checking in-memory store: {}", e.getMessage());
            }
        }

        // Check in-memory store
        String holdKey = inMemoryTokenMap.get(holdToken);
        if (holdKey != null) {
            TableHold hold = inMemoryHolds.get(holdKey);
            if (hold != null) {
                return checkHoldValidity(hold, expectedTableId, expectedDate, expectedTimeSlot, sessionId);
            }
        }

        return Optional.empty();
    }

    private Optional<TableHold> checkHoldValidity(
            TableHold hold,
            Long expectedTableId,
            String expectedDate,
            String expectedTimeSlot,
            String sessionId
    ) {
        if (!hold.getSessionId().equals(sessionId)) {
            return Optional.empty();
        }
        if (!hold.getTableId().equals(expectedTableId) ||
            !hold.getDate().equals(expectedDate) ||
            !hold.getTimeSlot().equalsIgnoreCase(expectedTimeSlot)) {
            return Optional.empty();
        }
        if (System.currentTimeMillis() > hold.getExpiresAt()) {
            return Optional.empty();
        }
        return Optional.of(hold);
    }

    /**
     * Retrieves active hold on a table.
     */
    public Optional<TableHold> getHold(Long tableId, String date, String timeSlot) {
        String holdKey = buildHoldKey(tableId, date, timeSlot);

        if (redisTemplate != null) {
            try {
                Object obj = redisTemplate.opsForValue().get(holdKey);
                if (obj instanceof TableHold hold) {
                    if (System.currentTimeMillis() <= hold.getExpiresAt()) {
                        return Optional.of(hold);
                    }
                }
            } catch (Exception e) {
                log.debug("Redis error on getHold: {}", e.getMessage());
            }
        }

        TableHold hold = inMemoryHolds.get(holdKey);
        if (hold != null) {
            if (System.currentTimeMillis() <= hold.getExpiresAt()) {
                return Optional.of(hold);
            } else {
                inMemoryHolds.remove(holdKey);
                inMemoryTokenMap.remove(hold.getHoldToken());
            }
        }
        return Optional.empty();
    }

    /**
     * Safely releases a temporary hold upon confirmation or cancellation.
     */
    public boolean releaseHold(String holdToken) {
        if (holdToken == null || holdToken.isBlank()) return false;
        boolean released = false;

        if (redisTemplate != null) {
            try {
                String tokenKey = buildTokenKey(holdToken);
                Object holdKeyObj = redisTemplate.opsForValue().get(tokenKey);
                if (holdKeyObj != null) {
                    String holdKey = holdKeyObj.toString();
                    Object holdObj = redisTemplate.opsForValue().get(holdKey);
                    redisTemplate.delete(holdKey);
                    redisTemplate.delete(tokenKey);
                    if (holdObj instanceof TableHold hold) {
                        availabilityCacheService.evictAvailability(hold.getDate(), hold.getTimeSlot());
                    }
                    released = true;
                }
            } catch (Exception e) {
                log.warn("Redis release hold error: {}", e.getMessage());
            }
        }

        String holdKey = inMemoryTokenMap.remove(holdToken);
        if (holdKey != null) {
            TableHold hold = inMemoryHolds.remove(holdKey);
            if (hold != null) {
                availabilityCacheService.evictAvailability(hold.getDate(), hold.getTimeSlot());
            }
            released = true;
        }

        return released;
    }
}
