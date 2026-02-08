package com.personachatgrid.backend.controller;

import com.personachatgrid.backend.model.PromptAnalysisResponse;
import com.personachatgrid.backend.service.PromptAnalysisService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/prompt")
@Log4j2
public class PromptController {

    @Autowired
    private com.personachatgrid.backend.repository.UserRepository userRepository;

    @Autowired
    private PromptAnalysisService promptAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<PromptAnalysisResponse> analyze(
            @RequestBody Map<String, String> request,
            org.springframework.security.core.Authentication authentication) {
        
        String prompt = request.get("prompt");
        if (prompt == null || prompt.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        if (authentication != null) {
            String email = authentication.getName();
            com.personachatgrid.backend.model.User user = userRepository.findByEmail(email).orElse(null);
            if (user != null && user.isPremium()) {
                if (user.getCredits() <= 0) {
                    return ResponseEntity.status(402).build(); // Payment Required / Insufficient Credits
                }
                user.setCredits(user.getCredits() - 1);
                userRepository.save(user);
            }
        }

        return ResponseEntity.ok(promptAnalysisService.analyzePrompt(prompt));
    }
}
