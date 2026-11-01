package com.dev.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {

    private String holdToken;

    @NotNull(message = "Table ID is required")
    private Long tableId;

    @NotBlank(message = "Reservation date is required")
    private String date;

    @NotBlank(message = "Time slot is required")
    private String timeSlot;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    private Integer guestCount;

    @NotBlank(message = "Session ID is required")
    private String sessionId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    private String specialRequests;

    private String paymentStatus;
    private String paymentMethod;
    private String transactionId;
    private Object cartItems;
    private Object billBreakdown;
}
