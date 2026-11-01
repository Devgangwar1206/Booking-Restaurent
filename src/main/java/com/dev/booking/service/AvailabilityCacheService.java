package com.dev.booking.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class AvailabilityCacheService {

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    @Value("${booking.restaurant-id:royal_spices_main}")
    private String restaurantId;

    @Value("${booking.cache.availability-ttl-seconds:60}")
    private long availabilityTtlSeconds;

    // In-memory fallback if Redis is not running
    private final ConcurrentHashMap<String, CacheEntry> inMemoryCache = new ConcurrentHashMap<>();

    private record CacheEntry(Object data, long expireAt) {}

    public String buildAvailabilityKey(String date, String timeSlot) {
        return String.format("avail:restaurant:%s:%s:%s", restaurantId, date, timeSlot);
    }

    public Object getCachedAvailability(String date, String timeSlot) {
        String key = buildAvailabilityKey(date, timeSlot);

        if (redisTemplate != null) {
            try {
                Object cached = redisTemplate.opsForValue().get(key);
                if (cached != null) return cached;
            } catch (Exception e) {
                log.debug("Redis cache read skipped: {}", e.getMessage());
            }
        }

        // In-memory fallback
        CacheEntry entry = inMemoryCache.get(key);
        if (entry != null) {
            if (System.currentTimeMillis() <= entry.expireAt()) {
                return entry.data();
            } else {
                inMemoryCache.remove(key);
            }
        }
        return null;
    }

    public void putCachedAvailability(String date, String timeSlot, Object data) {
        String key = buildAvailabilityKey(date, timeSlot);

        if (redisTemplate != null) {
            try {
                redisTemplate.opsForValue().set(key, data, availabilityTtlSeconds, TimeUnit.SECONDS);
            } catch (Exception e) {
                log.debug("Redis cache write skipped: {}", e.getMessage());
            }
        }

        // In-memory fallback
        long expireAt = System.currentTimeMillis() + (availabilityTtlSeconds * 1000);
        inMemoryCache.put(key, new CacheEntry(data, expireAt));
    }

    public void evictAvailability(String date, String timeSlot) {
        String key = buildAvailabilityKey(date, timeSlot);

        if (redisTemplate != null) {
            try {
                redisTemplate.delete(key);
                log.info("Invalidated availability cache in Redis for {} at {}", date, timeSlot);
            } catch (Exception e) {
                log.debug("Redis cache eviction skipped: {}", e.getMessage());
            }
        }

        inMemoryCache.remove(key);
    }
}
