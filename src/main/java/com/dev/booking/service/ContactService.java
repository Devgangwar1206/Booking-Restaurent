package com.dev.booking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.dev.booking.dto.ContactRequestDto;

@Service
public class ContactService {

    private final RestClient restClient;

    @Value("${brevo.api-key}")
    private String apiKey;

    @Value("${brevo.sender-email}")
    private String senderEmail;

    @Value("${brevo.sender-name}")
    private String senderName;

    @Value("${brevo.receiver-email}")
    private String receiverEmail;

    public ContactService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.brevo.com")
                .build();
    }

    public void sendContactMessage(ContactRequestDto contact) {

        String emailBody =
                "You have received a new message from the Royal Spice website.\n\n"
                + "Name: " + contact.getName() + "\n"
                + "Email: " + contact.getEmail() + "\n"
                + "Phone: " + contact.getPhone() + "\n\n"
                + "Message:\n"
                + contact.getMessage()
                + "\n\n"
                + "--------------------------------\n"
                + "Royal Spice Website Contact Form";

        BrevoEmailRequest request = new BrevoEmailRequest(
                new Sender(senderEmail, senderName),
                new Recipient(receiverEmail),
                "New Contact Message - Royal Spice",
                emailBody
        );

        restClient.post()
                .uri("/v3/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    private record BrevoEmailRequest(
            Sender sender,
            Recipient[] to,
            String subject,
            String textContent
    ) {
        public BrevoEmailRequest(
                Sender sender,
                Recipient recipient,
                String subject,
                String textContent
        ) {
            this(
                    sender,
                    new Recipient[]{recipient},
                    subject,
                    textContent
            );
        }
    }

    private record Sender(
            String email,
            String name
    ) {
    }

    private record Recipient(
            String email
    ) {
    }
}