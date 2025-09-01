package com.LearnifyOrg.learnify.Repository;
import com.LearnifyOrg.learnify.Entity.TopicContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<TopicContent,Long>{
    List<TopicContent> findBySectionsSectionId(Long section_Id);
}
