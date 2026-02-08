package com.personachatgrid.backend.repository;

import com.personachatgrid.backend.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, String> {
    List<Conversation> findByUserEmailOrderByUpdatedAtDesc(String email);
}
