package com.personachatgrid.backend.model;

public class SendMessageRequest {
    private String message;
    private String aiModel;
    private String conversationId;

    public SendMessageRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }

    public String getConversationId() { return conversationId; }

    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
}