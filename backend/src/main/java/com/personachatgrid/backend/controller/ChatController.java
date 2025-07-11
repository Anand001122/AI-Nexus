package com.personachatgrid.backend.controller;

import com.personachatgrid.backend.model.Conversation;
import com.personachatgrid.backend.model.CreateConversationRequest;
import com.personachatgrid.backend.model.SendMessageRequest;
import com.personachatgrid.backend.model.SendMessageResponse;
import com.personachatgrid.backend.service.AiChatService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://chat-grid.vercel.app/") // Adjust for your frontend URL
@Log4j2
public class ChatController {

    @Autowired
    private AiChatService aiChatService;

    @PostMapping("/chat/send")
    public ResponseEntity<SendMessageResponse> sendMessage(@RequestBody SendMessageRequest request) {
        log.info("POST /chat/send called with request: {}", request);
        try {
            SendMessageResponse response = aiChatService.sendMessage(request);
            log.info("Response: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in sendMessage", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<Conversation> getConversation(@PathVariable String conversationId) {
        log.info("GET /conversations/{} called", conversationId);
        try {
            Conversation conversation = aiChatService.getConversation(conversationId);
            log.info("Conversation: {}", conversation);
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            log.error("Error in getConversation", e);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/conversations")
    public ResponseEntity<Conversation> createConversation(@RequestBody CreateConversationRequest request) {
        log.info("POST /conversations called with request: {}", request);
        try {
            Conversation conversation = aiChatService.createConversation(request.getAiModel());
            log.info("Created conversation: {}", conversation);
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            log.error("Error in createConversation", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<Void> clearConversation(@PathVariable String conversationId) {
        log.info("DELETE /conversations/{} called", conversationId);
        try {
            aiChatService.clearConversation(conversationId);
            log.info("Cleared conversation: {}", conversationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error in clearConversation", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
