package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Entity.Query;
import com.LearnifyOrg.learnify.Entity.Reply;
import com.LearnifyOrg.learnify.Repository.QueryRepository;
import com.LearnifyOrg.learnify.Repository.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private QueryRepository queryRepository;

    public Reply addReply(Reply reply) {
        // Fetch query by ID
        Query query = queryRepository.findById(reply.getQuery().getQueryId())
                .orElseThrow(() -> new RuntimeException("Query not found"));

        // Validate subject match
        if (!query.getSubjectName().equalsIgnoreCase(reply.getSubjectName())) {
            throw new RuntimeException("Subject does not match the query's subject");
        }

        // Ensure correct association
        reply.setQuery(query);
        return replyRepository.save(reply);
    }

    // Delete reply if it belongs to the given learner
    public void deleteReply(int replyId, int learnerId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        if (reply.getLearnerId() != learnerId) {
            throw new RuntimeException("You are not authorized to delete this reply");
        }

        replyRepository.deleteById(replyId);
    }

    // Get replies filtered by subject name
    public List<Reply> getReplyBySubject(String subjectName) {
        return replyRepository.findBySubjectName(subjectName);
    }

    public List<Reply> getAllReplies() {
        return replyRepository.findAll();
    }
}