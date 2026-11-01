package com.dev.booking.model;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableHold implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long tableId;
    private String date;
    private String timeSlot;
    private Integer guestCount;
    private String holdToken;
    private String sessionId;
    private String customerName;
    private Long createdAt;
    private Long expiresAt;
}
