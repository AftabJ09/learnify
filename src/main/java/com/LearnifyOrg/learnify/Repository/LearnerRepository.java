package com.LearnifyOrg.learnify.Repository;

import com.LearnifyOrg.learnify.Entity.Learner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearnerRepository extends JpaRepository<Learner,Integer> {
}
