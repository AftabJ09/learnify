package com.LearnifyOrg.learnify.Repository;

import com.LearnifyOrg.learnify.Entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress,Long> {
    List<Progress> findByLearnerIdOrderByIdDesc(Long learnerId);
}
