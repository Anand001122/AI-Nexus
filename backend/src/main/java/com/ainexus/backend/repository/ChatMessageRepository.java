package com.ainexus.backend.repository;

import com.ainexus.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByConversationUserEmail(String email);
    List<ChatMessage> findAllByIsUserFalse();
}
