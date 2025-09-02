package com.LearnifyOrg.learnify.Entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="quiz")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quiz_Id;
    private String question;
    private String OptionA;
    private String OptionB;
    private String OptionC;
    private String OptionD;
    private String Answer;

    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "subject_id")
    private Subjects subjects;
}
