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
import java.util.List;

@RestController
@RequestMapping("/api")
@Log4j2
public class ChatController {

    @Autowired
    private AiChatService aiChatService;

    @PostMapping("/chat/send")
    public ResponseEntity<SendMessageResponse> sendMessage(@RequestBody SendMessageRequest request, java.security.Principal principal) {
        log.info("POST /chat/send called by user: {}", principal.getName());
        try {
            SendMessageResponse response = aiChatService.sendMessage(request, principal.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in sendMessage", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<Conversation> getConversation(@PathVariable String conversationId) {
        try {
            Conversation conversation = aiChatService.getConversation(conversationId);
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            log.error("Error in getConversation", e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getUserConversations(java.security.Principal principal) {
        try {
            return ResponseEntity.ok(aiChatService.getUserConversations(principal.getName()));
        } catch (Exception e) {
            log.error("Error in getUserConversations", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/conversations")
    public ResponseEntity<Conversation> createConversation(@RequestBody CreateConversationRequest request, java.security.Principal principal) {
        // This is handled automatically by sendMessage if needed, but keeping for direct creation
        return ResponseEntity.ok(null); // Will implement properly if needed or use sendMessage
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<Void> clearConversation(@PathVariable String conversationId) {
        try {
            aiChatService.clearConversation(conversationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error in clearConversation", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
