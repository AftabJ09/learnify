package com.LearnifyOrg.learnify.Repository;

import com.LearnifyOrg.learnify.Controller.QuizController;
import com.LearnifyOrg.learnify.Entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz,Long> {
    List<Quiz> findBySubjects_SubjectId(Long subjectId);

}
