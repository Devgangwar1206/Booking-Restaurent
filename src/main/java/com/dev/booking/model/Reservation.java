package com.dev.booking.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "reservations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_table_date_slot_confirmed",
            columnNames = {"table_id", "reservation_date", "time_slot", "status"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable table;

    @Column(name = "reservation_date", nullable = false)
    private String date;

    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    @Column(nullable = false)
    private Integer guestCount;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String customerPhone;

    @Column(length = 1000)
    private String specialRequests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    private String holdTokenUsed;

    private String paymentStatus; // "PAID", "PAY_AT_RESTAURANT"
    private String paymentMethod;
    private String transactionId;

    @Column(columnDefinition = "TEXT")
    private String cartItemsJson;

    @Column(columnDefinition = "TEXT")
    private String billBreakdownJson;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
