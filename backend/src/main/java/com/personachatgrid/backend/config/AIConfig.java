package com.personachatgrid.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import java.util.Map;
import java.util.HashMap;


@Getter
@Setter
@Log4j2
@Configuration
@ConfigurationProperties(prefix = "openrouter")
public class AIConfig {
    private String endpoint;

    private final Map<String, String> models = new HashMap<>();
    private final Map<String, String> apiKeys = new HashMap<>();

    public String getModelIdentifier(String modelName) {
        String id = models.get(modelName.toLowerCase());
        if (id == null) {
            log.warn("Model identifier not found for model: {}", modelName);
        } else {
            log.debug("Model identifier for {}: {}", modelName, id);
        }
        return id;
    }

    public String getApiKeyForModel(String modelName) {
        String key = apiKeys.get(modelName.toLowerCase());
        if (key == null) {
            log.warn("API key not found for model: {}", modelName);
        } else {
            log.debug("API key found for model: {}", modelName);
        }
        return key;
    }
}