package com.LearnifyOrg.learnify.Repository;

import com.LearnifyOrg.learnify.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    boolean existsByEmail(String email);
}