package com.dev.booking.controller;

import com.dev.booking.dto.PaymentOrderRequest;
import com.dev.booking.dto.PaymentOrderResponse;
import com.dev.booking.dto.PaymentVerifyRequest;
import com.dev.booking.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class PaymentController {

    private final RazorpayService razorpayService;

    @GetMapping("/key")
    public ResponseEntity<?> getPublicKey() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "keyId", razorpayService.getKeyId()
        ));
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createOrder(@RequestBody PaymentOrderRequest request) {
        log.info("Received request to create Razorpay order for ₹{}", request.getAmount());
        PaymentOrderResponse response = razorpayService.createOrder(request);

        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        log.info("Verifying Razorpay payment: orderId={}, paymentId={}",
                request.getRazorpayOrderId(), request.getRazorpayPaymentId());

        boolean isValid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (isValid) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment verified successfully",
                    "orderId", request.getRazorpayOrderId(),
                    "paymentId", request.getRazorpayPaymentId()
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Payment verification failed. Invalid signature."
            ));
        }
    }
}
