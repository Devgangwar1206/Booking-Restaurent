package com.dev.booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.booking.dto.ContactRequestDto;
import com.dev.booking.service.ContactService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<String> sendMessage(
            @Valid @RequestBody ContactRequestDto contact) {

    	
        contactService.sendContactMessage(contact);

        return ResponseEntity.ok("Message sent successfully");
    }
}