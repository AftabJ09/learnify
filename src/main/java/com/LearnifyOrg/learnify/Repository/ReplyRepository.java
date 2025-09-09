package com.LearnifyOrg.learnify.Repository;

import com.LearnifyOrg.learnify.Entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {
    List<Reply> findBySubjectName(String subjectName);

    List<Reply> findByQuery_QueryId(int queryId);
}