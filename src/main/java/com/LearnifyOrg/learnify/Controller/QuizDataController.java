package com.LearnifyOrg.learnify.Controller;

import com.LearnifyOrg.learnify.Entity.Progress;
import com.LearnifyOrg.learnify.Services.QuizDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quizData")
public class QuizDataController {

    @Autowired
    private QuizDataService quizDataService;

    @GetMapping("/start")
    public ResponseEntity<Map<String, Object>> startQuiz(
            @RequestParam Long learnerId,
            @RequestParam Long subjectId) {
        return ResponseEntity.ok(quizDataService.startQuiz(learnerId, subjectId));
    }

    @PostMapping("/submit")
    public ResponseEntity<Progress> submitQuiz(
            @RequestParam Long learnerId,
            @RequestParam Long subjectId,
            @RequestBody Map<Long, String> responses) {
        return ResponseEntity.ok(quizDataService.submitQuiz(learnerId, subjectId, responses));
    }

    @GetMapping("/results")
    public ResponseEntity<List<Progress>> getResults(@RequestParam Long learnerId) {
        List<Progress> results = quizDataService.getResults(learnerId);
        return ResponseEntity.ok(results);
    }
}
