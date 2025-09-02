package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Entity.Quiz;
import com.LearnifyOrg.learnify.Entity.Sections;
import com.LearnifyOrg.learnify.Repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizServices {

    @Autowired
    private QuizRepository quizRepository;

    public Quiz AddQuestion(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public List<Quiz> getQuestions(Long subjectId) {
        return quizRepository.findBySubjects_SubjectId(subjectId);
    }


    public void deleteQuestion(Long quizId) {
        quizRepository.deleteById(quizId);
    }
}
