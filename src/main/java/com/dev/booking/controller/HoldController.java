package com.dev.booking.controller;

import com.dev.booking.dto.HoldRequest;
import com.dev.booking.dto.HoldResponse;
import com.dev.booking.model.ReservationStatus;
import com.dev.booking.model.RestaurantTable;
import com.dev.booking.model.TableHold;
import com.dev.booking.repository.ReservationRepository;
import com.dev.booking.repository.RestaurantTableRepository;
import com.dev.booking.service.TableHoldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/holds")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HoldController {

    private final TableHoldService tableHoldService;
    private final RestaurantTableRepository tableRepository;
    private final ReservationRepository reservationRepository;

    @PostMapping
    public ResponseEntity<HoldResponse> createHold(@Valid @RequestBody HoldRequest request) {
        // 1. Verify Table exists
        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElse(null);
        if (table == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(HoldResponse.builder().success(false).error("Table not found").build());
        }

        // 2. Capacity Check - accommodate groups with notification
        // 3. Verify not already confirmed in Database
        boolean isConfirmed = reservationRepository.existsByTableIdAndDateAndTimeSlotAndStatus(
                request.getTableId(), request.getDate(), request.getTimeSlot(), ReservationStatus.CONFIRMED);
        if (isConfirmed) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(HoldResponse.builder()
                            .success(false)
                            .error("Table is already confirmed for this time slot")
                            .build());
        }

        // 4. Acquire Atomic Hold
        Optional<TableHold> holdOpt = tableHoldService.acquireHold(
                request.getTableId(),
                request.getDate(),
                request.getTimeSlot(),
                request.getGuestCount(),
                request.getSessionId(),
                request.getCustomerName(),
                request.getCustomTtlSeconds()
        );

        if (holdOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(HoldResponse.builder()
                            .success(false)
                            .error("Table is currently held by another customer. Please select another table.")
                            .build());
        }

        TableHold hold = holdOpt.get();
        long remainingSeconds = Math.max(0, (hold.getExpiresAt() - System.currentTimeMillis()) / 1000);

        return ResponseEntity.ok(HoldResponse.builder()
                .success(true)
                .message("Table hold acquired successfully")
                .hold(hold)
                .expiresInSeconds(remainingSeconds)
                .build());
    }

    @DeleteMapping
    public ResponseEntity<?> releaseHold(@RequestParam String holdToken) {
        boolean released = tableHoldService.releaseHold(holdToken);
        return ResponseEntity.ok().body(java.util.Map.of(
                "success", true,
                "released", released,
                "message", released ? "Hold released successfully" : "Hold not found or already expired"
        ));
    }

    @DeleteMapping("/{token}")
    public ResponseEntity<?> releaseHoldByPath(@PathVariable String token) {
        boolean released = tableHoldService.releaseHold(token);
        return ResponseEntity.ok().body(java.util.Map.of(
                "success", true,
                "released", released,
                "message", released ? "Hold released successfully" : "Hold not found or already expired"
        ));
    }
}
