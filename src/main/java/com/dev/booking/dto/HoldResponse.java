package com.dev.booking.dto;

import com.dev.booking.model.TableHold;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoldResponse {
    private boolean success;
    private String message;
    private TableHold hold;
    private Long expiresInSeconds;
    private String error;
}
