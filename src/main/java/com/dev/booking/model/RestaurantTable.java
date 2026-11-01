package com.dev.booking.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurant_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tableNumber;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    private Integer minCapacity;

    @Column(nullable = false)
    private String shape; // "round", "rect", "booth"

    private String zone; // "Main Dining", "Center Lounge", "Window Booth", "Wall Alcove"

    private Double positionX;
    private Double positionY;
    private Double width;
    private Double height;

    @Column(length = 500)
    private String features;
}
