package com.ainexus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

public class AnalyticsModels {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModelPerformanceStats {
        private String modelId;
        private String displayName;
        private double avgResponseTime;
        private double avgWordCount;
        private double avgTokensPerSecond;
        private long messageCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonalAnalytics {
        private List<ModelPerformanceStats> modelStats;
        private List<DayMetrics> activityTrend;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayMetrics {
        private String date;
        private long messageCount;
        private double avgResponseTime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GlobalLeaderboard {
        private List<ModelPerformanceStats> topBySpeed;
        private List<ModelPerformanceStats> topByVolume;
        private List<ModelPerformanceStats> topByEfficiency;
        private List<GlobalUsageTrend> usageTrends;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GlobalUsageTrend {
        private String date;
        private Map<String, Long> modelCounts;
        private long totalCount;
    }
}
