package com.dev.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoldRequest {
    @NotNull(message = "Table ID is required")
    private Long tableId;

    @NotBlank(message = "Reservation date is required")
    private String date;

    @NotBlank(message = "Time slot is required")
    private String timeSlot;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    private Integer guestCount;

    @NotBlank(message = "Session ID is required for hold verification")
    private String sessionId;

    private String customerName;
    private Integer customTtlSeconds;
}
