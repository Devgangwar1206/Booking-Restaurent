package com.dev.booking.dto;

import lombok.*;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableAvailabilityDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String tableNumber;
    private String name;
    private Integer capacity;
    private Integer minCapacity;
    private String shape;
    private String zone;
    private String status; // "AVAILABLE", "HELD", "RESERVED"
    private boolean heldByCurrentSession;
    private String holdSessionId;
    private Long remainingHoldSeconds;
    private boolean suitableForGuests;
}
