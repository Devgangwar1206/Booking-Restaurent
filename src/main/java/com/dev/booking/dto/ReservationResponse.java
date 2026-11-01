package com.dev.booking.dto;

import com.dev.booking.model.Reservation;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {
    private boolean success;
    private String message;
    private Reservation reservation;
    private String error;
}
