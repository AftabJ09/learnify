package com.LearnifyOrg.learnify.Repository;
import com.LearnifyOrg.learnify.Entity.Sections;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Sections,Long> {


    List<Sections> findBySubjectsSubjectId(Long subjectId);

}
