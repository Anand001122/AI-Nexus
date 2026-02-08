package com.personachatgrid.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
public class ChatMessage {
    @Id
    private String id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private boolean isUser;
    private String timestamp;
    private String aiModel;

    @Embedded
    private ResponseMetrics metrics;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;
}
