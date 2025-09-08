package com.LearnifyOrg.learnify.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "queries")
public class Query {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int queryId;

    @Column(columnDefinition = "TEXT")
    private String query;

    private String subjectName;

    private int learnerId;

    private boolean verify = false;
}