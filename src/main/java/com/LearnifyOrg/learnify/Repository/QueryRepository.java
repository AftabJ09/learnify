package com.LearnifyOrg.learnify.Repository;

import com.LearnifyOrg.learnify.Entity.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueryRepository extends JpaRepository<Query, Integer> {
    List<Query> findBySubjectName(String subjectName);
    List<Query> findByLearnerId(Long learnerId);
}