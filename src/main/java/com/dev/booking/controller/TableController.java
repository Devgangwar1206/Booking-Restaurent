package com.dev.booking.controller;

import com.dev.booking.dto.TableAvailabilityDto;
import com.dev.booking.model.Reservation;
import com.dev.booking.model.ReservationStatus;
import com.dev.booking.model.RestaurantTable;
import com.dev.booking.model.TableHold;
import com.dev.booking.repository.ReservationRepository;
import com.dev.booking.repository.RestaurantTableRepository;
import com.dev.booking.service.AvailabilityCacheService;
import com.dev.booking.service.TableHoldService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TableController {

    private final RestaurantTableRepository tableRepository;
    private final ReservationRepository reservationRepository;
    private final TableHoldService tableHoldService;
    private final AvailabilityCacheService cacheService;

    @GetMapping("/tables")
    public ResponseEntity<?> getAllTables() {
        List<RestaurantTable> tables = tableRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "tables", tables));
    }

    @GetMapping("/availability")
    public ResponseEntity<?> getAvailability(
            @RequestParam String date,
            @RequestParam String timeSlot,
            @RequestParam(defaultValue = "2") Integer guestCount,
            @RequestParam(required = false) String sessionId,
            @RequestParam(defaultValue = "false") boolean refresh
    ) {
        // 1. Check Cache if not refreshing
        if (!refresh) {
            Object cached = cacheService.getCachedAvailability(date, timeSlot);
            if (cached instanceof List<?> cachedList) {
                List<TableAvailabilityDto> personalized = new ArrayList<>();
                for (Object item : cachedList) {
                    if (item instanceof TableAvailabilityDto dto) {
                        dto.setHeldByCurrentSession(sessionId != null && sessionId.equals(dto.getHoldSessionId()));
                        dto.setSuitableForGuests(guestCount <= dto.getCapacity());
                        personalized.add(dto);
                    }
                }
                if (!personalized.isEmpty()) {
                    return ResponseEntity.ok(Map.of("success", true, "cacheHit", true, "tables", personalized));
                }
            }
        }

        // 2. Compute availability from DB and active holds
        List<RestaurantTable> allTables = tableRepository.findAll();
        List<Reservation> confirmedBookings = reservationRepository
                .findByDateAndTimeSlotAndStatus(date, timeSlot, ReservationStatus.CONFIRMED);

        List<TableAvailabilityDto> result = new ArrayList<>();

        for (RestaurantTable table : allTables) {
            boolean isBooked = confirmedBookings.stream().anyMatch(b -> b.getTable().getId().equals(table.getId()));

            String status = "AVAILABLE";
            boolean heldByMe = false;
            String holdSessionId = null;
            long remainingSeconds = 0;

            if (isBooked) {
                status = "RESERVED";
            } else {
                Optional<TableHold> holdOpt = tableHoldService.getHold(table.getId(), date, timeSlot);
                if (holdOpt.isPresent()) {
                    TableHold hold = holdOpt.get();
                    status = "HELD";
                    holdSessionId = hold.getSessionId();
                    remainingSeconds = Math.max(0, (hold.getExpiresAt() - System.currentTimeMillis()) / 1000);
                    if (sessionId != null && sessionId.equals(hold.getSessionId())) {
                        heldByMe = true;
                    }
                }
            }

            result.add(TableAvailabilityDto.builder()
                    .id(table.getId())
                    .tableNumber(table.getTableNumber())
                    .name(table.getName())
                    .capacity(table.getCapacity())
                    .minCapacity(table.getMinCapacity())
                    .shape(table.getShape())
                    .zone(table.getZone())
                    .status(status)
                    .heldByCurrentSession(heldByMe)
                    .holdSessionId(holdSessionId)
                    .remainingHoldSeconds(remainingSeconds)
                    .suitableForGuests(guestCount <= table.getCapacity())
                    .build());
        }

        // Cache
        cacheService.putCachedAvailability(date, timeSlot, result);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "cacheHit", false,
                "date", date,
                "timeSlot", timeSlot,
                "tables", result
        ));
    }
}
