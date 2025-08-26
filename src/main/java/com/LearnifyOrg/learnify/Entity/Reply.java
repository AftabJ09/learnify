package com.LearnifyOrg.learnify.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Reply")
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int replyId;

    @Column(columnDefinition = "TEXT")
    private String reply;

    private int learnerId;
    private int queryId;

    private boolean verify = false;
}