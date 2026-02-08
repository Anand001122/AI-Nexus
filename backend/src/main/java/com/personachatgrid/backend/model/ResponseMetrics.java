package com.personachatgrid.backend.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class ResponseMetrics {
    private long responseTimeMs;
    private int wordCount;
    private double tokensPerSecond;

    public ResponseMetrics(long responseTimeMs, int wordCount) {
        this.responseTimeMs = responseTimeMs;
        this.wordCount = wordCount;
        this.tokensPerSecond = responseTimeMs > 0 ? (wordCount * 1.3) / (responseTimeMs / 1000.0) : 0;
    }
}
