package com.personachatgrid.backend.model;

public class CreateConversationRequest {
    private String aiModel;

    public CreateConversationRequest() {}

    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }
}
