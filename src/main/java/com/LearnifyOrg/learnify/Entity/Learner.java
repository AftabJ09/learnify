package com.LearnifyOrg.learnify.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class Learner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Learner_Id;

    private String name;
    private String email;
    private String password;
}
