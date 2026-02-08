package com.personachatgrid.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromptAnalysisResponse {
    private int score; // 1-10
    private String critique;
    private String optimizedPrompt;
    private boolean canImprove;
}
