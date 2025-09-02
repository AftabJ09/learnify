package com.LearnifyOrg.learnify.Controller;


import com.LearnifyOrg.learnify.Entity.Quiz;
import com.LearnifyOrg.learnify.Entity.Sections;
import com.LearnifyOrg.learnify.Services.QuizServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Quiz")
public class QuizController {

    @Autowired
    private QuizServices quizServices;
    @PostMapping("/AddQuestion")
    public ResponseEntity<Quiz> AddQuestion(@RequestBody Quiz quiz){
        return ResponseEntity.ok(quizServices.AddQuestion(quiz));
    }

    @GetMapping("/GetQuestion/{subjectId}")
    public ResponseEntity<List<Quiz>> GetQuestions(@PathVariable Long subjectId){
        return ResponseEntity.ok(quizServices.getQuestions(subjectId));
    }
    @DeleteMapping("/DeleteQuestion/{quizId}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long quizId) {
        quizServices.deleteQuestion(quizId);
        return ResponseEntity.ok("Question deleted successfully");
    }



}
