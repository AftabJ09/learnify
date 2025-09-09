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

    @Column(nullable = false)
    private String subjectName;

    @Transient  // not stored in DB
    private String learnerName;

    private boolean verify = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "query_id", nullable = false)
    private Query query;
}