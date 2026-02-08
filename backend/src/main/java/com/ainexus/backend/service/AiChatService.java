package com.ainexus.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ainexus.backend.config.AIConfig;
import com.ainexus.backend.model.ResponseMetrics;
import com.ainexus.backend.model.ChatMessage;
import com.ainexus.backend.model.Conversation;
import com.ainexus.backend.model.SendMessageRequest;
import com.ainexus.backend.model.SendMessageResponse;
import com.ainexus.backend.model.User;
import com.ainexus.backend.repository.ChatMessageRepository;
import com.ainexus.backend.repository.ConversationRepository;
import com.ainexus.backend.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Log4j2
@Service
public class AiChatService {

    private static final ObjectMapper mapper = new ObjectMapper();
    private final AIConfig aiConfig;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public AiChatService(AIConfig aiConfig){
        this.aiConfig = aiConfig;
    }
    
    public SendMessageResponse sendMessage(SendMessageRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseGet(() -> createConversation(request.getAiModel(), user));

        if (request.isExpertAdvice()) {
            if (user.getCredits() <= 0) {
                throw new RuntimeException("Insufficient credits for Expert Advice. Please upgrade or wait for a top-up!");
            }
            user.setCredits(user.getCredits() - 1);
            userRepository.save(user);
        }

        ChatMessage userMessage = new ChatMessage();
        userMessage.setId(UUID.randomUUID().toString());
        userMessage.setContent(request.getMessage());
        userMessage.setUser(true);
        userMessage.setTimestamp(LocalDateTime.now().toString());
        userMessage.setConversation(conversation);
        conversation.getMessages().add(userMessage);

        long startTime = System.currentTimeMillis();
        String aiResponse = generateAiResponse(conversation, request.getAiModel(), request.isExpertAdvice());
        long endTime = System.currentTimeMillis();
        
        long duration = endTime - startTime;
        int wordCount = aiResponse.trim().split("\\s+").length;
        ResponseMetrics metrics = new ResponseMetrics(duration, wordCount);
        
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setId(UUID.randomUUID().toString());
        aiMessage.setContent(aiResponse);
        aiMessage.setUser(false);
        aiMessage.setAiModel(request.getAiModel());
        aiMessage.setTimestamp(LocalDateTime.now().toString());
        aiMessage.setMetrics(metrics);
        aiMessage.setConversation(conversation);
        conversation.getMessages().add(aiMessage);

        conversation.setUpdatedAt(LocalDateTime.now().toString());
        conversationRepository.save(conversation);

        SendMessageResponse response = new SendMessageResponse();
        response.setId(aiMessage.getId());
        response.setContent(aiMessage.getContent());
        response.setAiModel(request.getAiModel());
        response.setConversationId(conversation.getId());
        response.setTimestamp(aiMessage.getTimestamp());
        response.setMetrics(metrics);
        
        return response;
    }
    
    public Conversation getConversation(String conversationId) {
        return conversationRepository.findById(conversationId).orElse(null);
    }
    
    public Conversation createConversation(String aiModel, User user) {
        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID().toString());
        conversation.setAiModel(aiModel);
        conversation.setMessages(new ArrayList<>());
        conversation.setCreatedAt(LocalDateTime.now().toString());
        conversation.setUpdatedAt(LocalDateTime.now().toString());
        conversation.setUser(user);
        
        return conversationRepository.save(conversation);
    }
    
    public void clearConversation(String conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElse(null);
        if (conversation != null) {
            chatMessageRepository.deleteAll(conversation.getMessages());
            conversation.getMessages().clear();
            conversation.setUpdatedAt(LocalDateTime.now().toString());
            conversationRepository.save(conversation);
        }
    }
    
    public List<Conversation> getUserConversations(String userEmail) {
        return conversationRepository.findByUserEmailOrderByUpdatedAtDesc(userEmail);
    }

    private String generateAiResponse(Conversation conversation, String model, boolean isExpertAdvice) {
        try {
            String modelIdentifier = aiConfig.getModelIdentifier(model);
            String apiKey = aiConfig.getApiKeyForModel(model);
            if (modelIdentifier == null || apiKey == null) {
                log.error("Missing configuration for model: {}", model);
                return "AI Error: Configuration missing for model " + model;
            }
            
            StringBuilder messagesJson = new StringBuilder();
            
            if (isExpertAdvice) {
                messagesJson.append("{");
                messagesJson.append("\"role\": \"system\",");
                messagesJson.append("\"content\": \"You are an expert consultant. Provide deep technical insights, critical analysis, and detailed explanations. Focus on accuracy and nuance.\"");
                messagesJson.append("},");
            }

            List<ChatMessage> history = conversation.getMessages();
            for (int i = 0; i < history.size(); i++) {
                ChatMessage m = history.get(i);
                messagesJson.append("{");
                messagesJson.append("\"role\": \"").append(m.isUser() ? "user" : "assistant").append("\",");
                messagesJson.append("\"content\": \"").append(sanitizeJson(m.getContent())).append("\"");
                messagesJson.append("}");
                if (i < history.size() - 1) {
                    messagesJson.append(",");
                }
            }

            String jsonContent = "{" +
                    "\"model\": \"" + modelIdentifier + "\"," +
                    "\"messages\": [" + messagesJson.toString() + "]" +
                    "}";

            HttpRequest rawRequest = HttpRequest.newBuilder()
                    .uri(URI.create(aiConfig.getEndpoint()))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .header("HTTP-Referer", "http://localhost:5173")
                    .header("X-Title", "AI Nexus")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonContent))
                    .timeout(Duration.ofSeconds(60))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient().send(rawRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("API Error Response: {}", response.body());
                return "API Error: HTTP " + response.statusCode();
            }

            JsonNode root = mapper.readTree(response.body());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            log.error("AI Service Error for model " + model, e);
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
