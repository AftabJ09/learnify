package com.LearnifyOrg.learnify.Entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "process")
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long learnerId;
    private Long subjectId;

    private int totalQuestions;
    private int correctAnswers;
    private int score;
    private long timeTaken;

    private String status;
}
