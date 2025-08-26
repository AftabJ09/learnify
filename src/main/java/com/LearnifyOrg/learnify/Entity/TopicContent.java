package com.LearnifyOrg.learnify.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "topic_content")
public class TopicContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topic_id")
    private Long topicId;

    @Column(name = "topic", nullable = false)
    private String topic;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    // Many topics belong to one section
    @ManyToOne
    @JoinColumn(name = "section_id", referencedColumnName = "section_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Sections sections;
}

