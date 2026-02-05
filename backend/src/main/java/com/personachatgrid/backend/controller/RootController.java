package com.personachatgrid.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class RootController {

    @GetMapping("/")
    public Map<String, String> root() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "AI Nexus Backend is running!");
        status.put("endpoints", "/api/chat/send, /api/conversations");
        return status;
    }

    @GetMapping("/api")
    public Map<String, String> apiRoot() {
        return root();
    }
}
