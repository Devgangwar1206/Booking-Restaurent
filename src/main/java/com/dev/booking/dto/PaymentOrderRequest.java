package com.dev.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderRequest {
    private Double amount; // In INR (e.g. 465.00)
    private String currency; // Default "INR"
    private String receipt;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String tableNumber;
}
