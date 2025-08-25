package com.LearnifyOrg.learnify.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "section")
public class Sections {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    // Many sections belong to one subject
    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "subject_id")
    private Subjects subjects;

    // Parent side of Section → TopicContent
    @OneToMany(mappedBy = "sections", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TopicContent> topics;
}
