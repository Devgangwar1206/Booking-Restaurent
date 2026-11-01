package com.dev.booking.controller;

import com.dev.booking.dto.ReservationRequest;
import com.dev.booking.dto.ReservationResponse;
import com.dev.booking.model.Reservation;
import com.dev.booking.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        try {
            Reservation reservation = reservationService.confirmReservation(request);
            return ResponseEntity.ok(ReservationResponse.builder()
                    .success(true)
                    .message("Reservation confirmed successfully")
                    .reservation(reservation)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ReservationResponse.builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ReservationResponse.builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ReservationResponse.builder()
                    .success(false)
                    .error("Server error while confirming reservation: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{reference}")
    public ResponseEntity<?> getReservation(@PathVariable String reference) {
        return reservationService.getByReference(reference)
                .map(r -> ResponseEntity.ok(java.util.Map.of("success", true, "reservation", r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping
    public ResponseEntity<?> resetReservations(@RequestParam(defaultValue = "false") boolean reset) {
        if (reset) {
            reservationService.resetAllReservations();
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Reservations reset successfully"));
        }
        return ResponseEntity.badRequest().body(java.util.Map.of("success", false, "error", "reset parameter required"));
    }
}
