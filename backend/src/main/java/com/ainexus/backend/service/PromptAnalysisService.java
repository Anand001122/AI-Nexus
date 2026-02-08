package com.ainexus.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ainexus.backend.config.AIConfig;
import com.ainexus.backend.model.PromptAnalysisResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Log4j2
@Service
public class PromptAnalysisService {

    private final AIConfig aiConfig;
    private static final ObjectMapper mapper = new ObjectMapper();

    public PromptAnalysisService(AIConfig aiConfig) {
        this.aiConfig = aiConfig;
    }

    public PromptAnalysisResponse analyzePrompt(String prompt) {
        try {
            String modelIdentifier = aiConfig.getModelIdentifier("gemini");
            String apiKey = aiConfig.getApiKeyForModel("gemini");

            if (modelIdentifier == null || apiKey == null) {
                return new PromptAnalysisResponse(5, "Missing AI configuration.", prompt, false);
            }

            String systemPrompt = "You are an expert Prompt Engineer. Analyze the user's prompt. " +
                    "Return ONLY a JSON object with strictly these keys: " +
                    "'score' (integer 1-10), 'critique' (string, max 100 chars), " +
                    "'optimizedPrompt' (string, rewrite the prompt to be professional, clear and detailed), " +
                    "'canImprove' (boolean).";

            String jsonRequest = String.format("""
                {
                  "model": "%s",
                  "messages": [
                    {"role": "system", "content": "%s"},
                    {"role": "user", "content": "%s"}
                  ],
                  "response_format": { "type": "json_object" }
                }
                """, modelIdentifier, systemPrompt.replace("\"", "\\\""), prompt.replace("\"", "\\\"").replace("\n", "\\n"));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiConfig.getEndpoint()))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Prompt analysis API error: {}", response.body());
                return calculateHeuristicScore(prompt);
            }

            JsonNode root = mapper.readTree(response.body());
            String aiJson = root.path("choices").get(0).path("message").path("content").asText();
            
            // Handle some LLMs that wrap JSON in backticks
            if (aiJson.contains("```json")) {
                aiJson = aiJson.substring(aiJson.indexOf("```json") + 7);
                aiJson = aiJson.substring(0, aiJson.lastIndexOf("```"));
            } else if (aiJson.contains("```")) {
                aiJson = aiJson.substring(aiJson.indexOf("```") + 3);
                aiJson = aiJson.substring(0, aiJson.lastIndexOf("```"));
            }

            return mapper.readValue(aiJson, PromptAnalysisResponse.class);

        } catch (Exception e) {
            log.error("Error in prompt analysis service", e);
            return calculateHeuristicScore(prompt);
        }
    }

    private PromptAnalysisResponse calculateHeuristicScore(String prompt) {
        // Fast fallback for real-time meter
        int score = Math.min(10, prompt.trim().length() / 20 + 2);
        if (prompt.contains("?")) score += 1;
        if (prompt.split("\\s+").length > 10) score += 2;
        
        score = Math.min(10, score);
        
        return new PromptAnalysisResponse(
            score, 
            "Score based on length and structure (Fallback).", 
            prompt, 
            score < 8
        );
    }
}
