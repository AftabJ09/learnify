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
    @Column(unique = true, nullable = false)   // ✅ email must be unique
    private String email;
    private String password;
}
