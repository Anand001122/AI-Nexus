package com.ainexus.backend.service;

import com.ainexus.backend.model.AnalyticsModels.*;
import com.ainexus.backend.model.ChatMessage;
import com.ainexus.backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public PersonalAnalytics getPersonalAnalytics(String userEmail) {
        List<ChatMessage> messages = chatMessageRepository.findByConversationUserEmail(userEmail)
                .stream().filter(m -> !m.isUser() && m.getMetrics() != null).collect(Collectors.toList());

        List<ModelPerformanceStats> modelStats = aggregateByModel(messages);
        List<DayMetrics> activityTrend = aggregateByDate(messages);

        return new PersonalAnalytics(modelStats, activityTrend);
    }

    public GlobalLeaderboard getGlobalLeaderboard() {
        List<ChatMessage> allAiMessages = chatMessageRepository.findAllByIsUserFalse()
                .stream().filter(m -> m.getMetrics() != null).collect(Collectors.toList());

        List<ModelPerformanceStats> stats = aggregateByModel(allAiMessages);

        List<ModelPerformanceStats> topBySpeed = new ArrayList<>(stats);
        topBySpeed.sort(Comparator.comparingDouble(ModelPerformanceStats::getAvgResponseTime));

        List<ModelPerformanceStats> topByVolume = new ArrayList<>(stats);
        topByVolume.sort(Comparator.comparingLong(ModelPerformanceStats::getMessageCount).reversed());

        List<ModelPerformanceStats> topByEfficiency = new ArrayList<>(stats);
        topByEfficiency.sort(Comparator.comparingDouble(ModelPerformanceStats::getAvgTokensPerSecond).reversed());

        List<GlobalUsageTrend> usageTrends = aggregateGlobalTrends(allAiMessages);

        return new GlobalLeaderboard(
                topBySpeed.stream().limit(5).collect(Collectors.toList()),
                topByVolume.stream().limit(5).collect(Collectors.toList()),
                topByEfficiency.stream().limit(5).collect(Collectors.toList()),
                usageTrends
        );
    }

    private List<GlobalUsageTrend> aggregateGlobalTrends(List<ChatMessage> messages) {
        Map<String, List<ChatMessage>> groupedByDate = messages.stream()
                .filter(m -> m.getTimestamp() != null && m.getAiModel() != null)
                .collect(Collectors.groupingBy(m -> m.getTimestamp().substring(0, 10)));

        return groupedByDate.entrySet().stream().map(entry -> {
            String date = entry.getKey();
            List<ChatMessage> msgs = entry.getValue();
            
            Map<String, Long> counts = msgs.stream()
                    .collect(Collectors.groupingBy(ChatMessage::getAiModel, Collectors.counting()));
            
            return new GlobalUsageTrend(date, counts, msgs.size());
        }).sorted(Comparator.comparing(GlobalUsageTrend::getDate)).collect(Collectors.toList());
    }

    private List<ModelPerformanceStats> aggregateByModel(List<ChatMessage> messages) {
        Map<String, List<ChatMessage>> grouped = messages.stream()
                .filter(m -> m.getAiModel() != null)
                .collect(Collectors.groupingBy(ChatMessage::getAiModel));

        return grouped.entrySet().stream().map(entry -> {
            String model = entry.getKey();
            List<ChatMessage> msgs = entry.getValue();
            double avgTime = msgs.stream().mapToLong(m -> m.getMetrics().getResponseTimeMs()).average().orElse(0);
            double avgWords = msgs.stream().mapToInt(m -> m.getMetrics().getWordCount()).average().orElse(0);
            double avgTps = msgs.stream().mapToDouble(m -> m.getMetrics().getTokensPerSecond()).average().orElse(0);
            return new ModelPerformanceStats(model, avgTime, avgWords, avgTps, msgs.size());
        }).collect(Collectors.toList());
    }

    private List<DayMetrics> aggregateByDate(List<ChatMessage> messages) {
        Map<String, List<ChatMessage>> grouped = messages.stream()
                .filter(m -> m.getTimestamp() != null)
                .collect(Collectors.groupingBy(m -> m.getTimestamp().substring(0, 10))); // ISO date yyyy-MM-dd

        return grouped.entrySet().stream().map(entry -> {
            String date = entry.getKey();
            List<ChatMessage> msgs = entry.getValue();
            double avgTime = msgs.stream().mapToLong(m -> m.getMetrics().getResponseTimeMs()).average().orElse(0);
            return new DayMetrics(date, msgs.size(), avgTime);
        }).sorted(Comparator.comparing(DayMetrics::getDate)).collect(Collectors.toList());
    }
}
