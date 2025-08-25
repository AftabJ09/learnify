package com.LearnifyOrg.learnify.Entity;

import com.LearnifyOrg.learnify.Entity.Sections;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "subject")
public class Subjects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    // Parent side of Subject → Section
    @OneToMany(mappedBy = "subjects", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Sections> sections;
}