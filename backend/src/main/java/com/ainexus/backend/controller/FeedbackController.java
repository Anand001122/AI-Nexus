package com.ainexus.backend.controller;

import com.ainexus.backend.model.Feedback;
import com.ainexus.backend.repository.FeedbackRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/feedback")
@Log4j2
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping
    public ResponseEntity<Void> submitFeedback(@RequestBody Feedback feedback, Principal principal) {
        try {
            if (principal != null) {
                feedback.setUserEmail(principal.getName());
            }
            feedbackRepository.save(feedback);
            log.info("Feedback submitted by: {}", principal != null ? principal.getName() : "Anonymous");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error submitting feedback", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
