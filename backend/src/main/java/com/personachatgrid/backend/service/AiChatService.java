package com.personachatgrid.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.personachatgrid.backend.config.AIConfig;
import com.personachatgrid.backend.model.ChatMessage;
import com.personachatgrid.backend.model.Conversation;
import com.personachatgrid.backend.model.SendMessageRequest;
import com.personachatgrid.backend.model.SendMessageResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Log4j2
@Service
public class AiChatService {

    private static final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, Conversation> conversations = new ConcurrentHashMap<>();
    private final AIConfig  aiConfig;

    public AiChatService(AIConfig aiConfig){
        this.aiConfig = aiConfig;
    }
    
    public SendMessageResponse sendMessage(SendMessageRequest request) {

        Conversation conversation = conversations.get(request.getConversationId());
        if (conversation == null) {
            conversation = createConversation(request.getAiModel());
        }

        ChatMessage userMessage = new ChatMessage();
        userMessage.setId(UUID.randomUUID().toString());
        userMessage.setContent(request.getMessage());
        userMessage.setUser(true);
        userMessage.setTimestamp(LocalDateTime.now().toString());
        conversation.getMessages().add(userMessage);

        String aiResponse = generateAiResponse(request.getMessage(), request.getAiModel());
        
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setId(UUID.randomUUID().toString());
        aiMessage.setContent(aiResponse);
        aiMessage.setUser(false);
        aiMessage.setTimestamp(LocalDateTime.now().toString());
        conversation.getMessages().add(aiMessage);

        conversation.setUpdatedAt(LocalDateTime.now().toString());
        conversations.put(conversation.getId(), conversation);

        SendMessageResponse response = new SendMessageResponse();
        response.setId(aiMessage.getId());
        response.setContent(aiMessage.getContent());
        response.setAiModel(request.getAiModel());
        response.setConversationId(conversation.getId());
        response.setTimestamp(aiMessage.getTimestamp());
        
        return response;
    }
    
    public Conversation getConversation(String conversationId) {
        return conversations.get(conversationId);
    }
    
    public Conversation createConversation(String aiModel) {
        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID().toString());
        conversation.setAiModel(aiModel);
        conversation.setMessages(new ArrayList<>());
        conversation.setCreatedAt(LocalDateTime.now().toString());
        conversation.setUpdatedAt(LocalDateTime.now().toString());
        
        conversations.put(conversation.getId(), conversation);
        return conversation;
    }
    
    public void clearConversation(String conversationId) {
        Conversation conversation = conversations.get(conversationId);
        if (conversation != null) {
            conversation.setMessages(new ArrayList<>());
            conversation.setUpdatedAt(LocalDateTime.now().toString());
            conversations.put(conversationId, conversation);
        }
    }
    
    private String generateAiResponse(String userMessage, String model) {
        try {
            String modelIdentifier = aiConfig.getModelIdentifier(model);
            String apiKey = aiConfig.getApiKeyForModel(model);
            if (modelIdentifier == null || apiKey == null) {
                log.error("Missing configuration for model: {}", model);
                return "AI Error: Configuration missing for model " + model;
            }
            String jsonContent = "{" +
                    "\"model\": \"" + modelIdentifier + "\"," + // Fixed this line
                    "\"messages\": [" +
                    "{" +
                    "\"role\": \"user\"," +
                    "\"content\": \"" + sanitizeJson(userMessage) + "\"" +
                    "}" +
                    "]" +
                    "}";

            log.debug("JSON: {}", jsonContent);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiConfig.getEndpoint()))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonContent))
                    .timeout(Duration.ofSeconds(30))
                    .build();

            log.debug("Sending request to {}", aiConfig.getEndpoint());
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            log.debug("Response status: {}", response.statusCode());

            if (response.statusCode() != 200) {
                return "API Error: HTTP " + response.statusCode() + " - " +
                        response.body().substring(0, Math.min(200, response.body().length()));
            }

            JsonNode root = mapper.readTree(response.body());
            String content = root.path("choices").get(0)
                    .path("message").path("content").asText();

            log.debug("AI Response: {}", content);
            return content;
        }catch (Exception e) {
            log.error("AI Service Error", e);
            return "AI Error: " + e.getMessage();
        }
    }

    private String sanitizeJson(String input) {
        return input.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
