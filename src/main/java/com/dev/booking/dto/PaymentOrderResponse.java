package com.dev.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponse {
    private boolean success;
    private String orderId;
    private Long amountInPaise;
    private Double amount;
    private String currency;
    private String keyId;
    private String error;
}
