package com.ainexus.backend.controller;

import com.ainexus.backend.model.AnalyticsModels.*;
import com.ainexus.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/personal")
    public ResponseEntity<PersonalAnalytics> getPersonalAnalytics(Principal principal) {
        return ResponseEntity.ok(analyticsService.getPersonalAnalytics(principal.getName()));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<GlobalLeaderboard> getGlobalLeaderboard() {
        return ResponseEntity.ok(analyticsService.getGlobalLeaderboard());
    }
}
