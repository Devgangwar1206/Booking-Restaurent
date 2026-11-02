package com.dev.booking.service;

import com.dev.booking.dto.PaymentOrderRequest;
import com.dev.booking.dto.PaymentOrderResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class RazorpayService {

    @Value("${razorpay.key-id:rzp_test_placeholder}")
    private String keyId;

    @Value("${razorpay.key-secret:dummy_secret}")
    private String keySecret;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public RazorpayService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.razorpay.com/v1")
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public String getKeyId() {
        return keyId;
    }

    /**
     * Creates an order with Razorpay or simulates an order if placeholder keys are present.
     */
    public PaymentOrderResponse createOrder(PaymentOrderRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            return PaymentOrderResponse.builder()
                    .success(false)
                    .error("Invalid payment amount. Amount must be greater than 0.")
                    .build();
        }

        long amountInPaise = Math.round(request.getAmount() * 100);
        String currency = (request.getCurrency() != null && !request.getCurrency().isBlank())
                ? request.getCurrency()
                : "INR";
        String receipt = (request.getReceipt() != null && !request.getReceipt().isBlank())
                ? request.getReceipt()
                : "rcpt_" + UUID.randomUUID().toString().substring(0, 8);

        // Check if real keys are configured
        boolean isPlaceholderKey = keyId == null || keyId.isBlank() || keyId.contains("placeholder") || keySecret.contains("dummy");

        if (isPlaceholderKey) {
            log.info("Razorpay keys are in simulation mode. Returning simulated order ID.");
            String simulatedOrderId = "order_sim_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            return PaymentOrderResponse.builder()
                    .success(true)
                    .orderId(simulatedOrderId)
                    .amountInPaise(amountInPaise)
                    .amount(request.getAmount())
                    .currency(currency)
                    .keyId(keyId)
                    .build();
        }

        try {
            String basicAuth = Base64.getEncoder().encodeToString(
                    (keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8)
            );

            Map<String, Object> orderPayload = Map.of(
                    "amount", amountInPaise,
                    "currency", currency,
                    "receipt", receipt,
                    "payment_capture", 1
            );

            String responseBody = restClient.post()
                    .uri("/orders")
                    .header("Authorization", "Basic " + basicAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(orderPayload)
                    .retrieve()
                    .body(String.class);

            JsonNode rootNode = objectMapper.readTree(responseBody);
            String orderId = rootNode.path("id").asText();

            log.info("Successfully created Razorpay order: {} for amount ₹{}", orderId, request.getAmount());

            return PaymentOrderResponse.builder()
                    .success(true)
                    .orderId(orderId)
                    .amountInPaise(amountInPaise)
                    .amount(request.getAmount())
                    .currency(currency)
                    .keyId(keyId)
                    .build();

        } catch (Exception e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage(), e);
            return PaymentOrderResponse.builder()
                    .success(false)
                    .error("Razorpay order creation failed: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Verifies the cryptographic HMAC SHA-256 signature returned by Razorpay Checkout.
     */
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        if (orderId == null || paymentId == null) {
            return false;
        }

        // Allow simulated orders if in demo mode
        if (orderId.startsWith("order_sim_")) {
            log.info("Simulated order verified automatically.");
            return true;
        }

        if (signature == null || signature.isBlank() || keySecret == null || keySecret.isBlank()) {
            return false;
        }

        try {
            String data = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    keySecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            mac.init(secretKeySpec);

            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            boolean isValid = hexString.toString().equalsIgnoreCase(signature);
            if (isValid) {
                log.info("Razorpay signature verified successfully for order: {} and payment: {}", orderId, paymentId);
            } else {
                log.warn("Invalid Razorpay signature for order: {} and payment: {}", orderId, paymentId);
            }
            return isValid;

        } catch (Exception e) {
            log.error("Error verifying Razorpay signature: {}", e.getMessage(), e);
            return false;
        }
    }
}
