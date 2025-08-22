package com.LearnifyOrg.learnify.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int admin_Id;

    private String name;
    @Column(nullable = false, unique = true) // ✅ ensures no duplicate emails
    private String email;
    private String password;
    private String passcode;
}
