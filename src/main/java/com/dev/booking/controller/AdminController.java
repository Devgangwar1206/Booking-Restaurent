package com.dev.booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.dev.booking.dto.LoginRequestDto;
import com.dev.booking.security.JwtService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AdminController(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequestDto request) {

        Authentication authentication =
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                    )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token =
                jwtService.generateToken(
                    userDetails.getUsername()
                );

        return ResponseEntity.ok(
                new LoginResponse(token)
        );
    }

    @GetMapping("/check")
    public ResponseEntity<String> checkAdmin(
            Authentication authentication) {

        if (authentication == null ||
            !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body("Not authenticated");
        }

        return ResponseEntity.ok("Authenticated");
    }

    @GetMapping
    public ResponseEntity<String> admin() {

        return ResponseEntity.ok(
                "Admin authentication successful"
        );
    }

    public record LoginResponse(String token) {}
}