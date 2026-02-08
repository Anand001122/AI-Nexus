package com.personachatgrid.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SendMessageRequest {
    private String message;
    private String aiModel;
    private String conversationId;
    private boolean isExpertAdvice;
}