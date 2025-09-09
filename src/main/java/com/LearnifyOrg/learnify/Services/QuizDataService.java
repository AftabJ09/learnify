package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Entity.Progress;
import com.LearnifyOrg.learnify.Entity.Quiz;
import com.LearnifyOrg.learnify.Repository.ProgressRepository;
import com.LearnifyOrg.learnify.Repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class QuizDataService {

    private record SessionData(List<Long> questionIds, Instant endTime) {}

    private final Map<String, SessionData> sessions = new ConcurrentHashMap<>();

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ProgressRepository progressRepository;

    public Map<String, Object> startQuiz(Long learnerId, Long subjectId) {
        String key = learnerId + ":" + subjectId;

        // If session already exists and not expired → return it
        SessionData existing = sessions.get(key);
        if (existing != null && Instant.now().isBefore(existing.endTime())) {
            List<Quiz> questions = fetchQuizzesByIds(existing.questionIds());
            return Map.of("questions", questions, "endTime", existing.endTime());
        } else {
            sessions.remove(key);
        }

        // Get questions
        List<Quiz> all = quizRepository.findBySubjects_SubjectId(subjectId);
        Collections.shuffle(all);
        List<Quiz> selected = all.size() <= 25 ? all : all.subList(0, 25);

        List<Long> ids = selected.stream().map(Quiz::getQuiz_Id).toList();

        // 1 minute per question
        Instant endTime = Instant.now().plus(Duration.ofMinutes(Math.max(1, ids.size())));
        sessions.put(key, new SessionData(ids, endTime));

        return Map.of("questions", selected, "endTime", endTime);
    }

    public Progress submitQuiz(Long learnerId, Long subjectId, Map<Long, String> responses) {
        String key = learnerId + ":" + subjectId;
        SessionData session = sessions.remove(key);

        List<Quiz> questions;
        if (session != null) {
            questions = fetchQuizzesByIds(session.questionIds());
        } else {
            questions = quizRepository.findBySubjects_SubjectId(subjectId);
        }

        int correct = 0;
        for (Quiz q : questions) {
            String given = responses.get(q.getQuiz_Id());
            if (given != null && given.equalsIgnoreCase(q.getAnswer())) {
                correct++;
            }
        }

        int total = questions.size();
        int score = total == 0 ? 0 : (int) Math.round((correct * 100.0) / total);

        Progress progress = new Progress();
        progress.setLearnerId(learnerId);
        progress.setSubjectId(subjectId);
        progress.setTotalQuestions(total);
        progress.setCorrectAnswers(correct);
        progress.setScore(score);
        progress.setTimeTaken(total * 60L); // 1 min per question (in seconds)
        progress.setStatus(score >= 40 ? "PASSED" : "FAILED");

        return progressRepository.save(progress);
    }

    private List<Quiz> fetchQuizzesByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return Collections.emptyList();
        List<Quiz> found = quizRepository.findAllById(ids);
        Map<Long, Quiz> map = new HashMap<>();
        for (Quiz q : found) map.put(q.getQuiz_Id(), q);
        List<Quiz> ordered = new ArrayList<>();
        for (Long id : ids) {
            if (map.containsKey(id)) ordered.add(map.get(id));
        }
        return ordered;
    }

    public List<Progress> getResults(Long learnerId) {
        return progressRepository.findByLearnerIdOrderByIdDesc(learnerId);
    }
}
