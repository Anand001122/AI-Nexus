package com.personachatgrid.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageResponse {
    private String id;
    private String content;
    private String aiModel;
    private String conversationId;
    private String timestamp;
    private ResponseMetrics metrics;
}
