package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Entity.Query;
import com.LearnifyOrg.learnify.Entity.Reply;
import com.LearnifyOrg.learnify.Repository.LearnerRepository;
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

    @Autowired
    private LearnerRepository learnerRepository; // fetch learner names

    public Reply addReply(Reply reply) {
        Query query = queryRepository.findById(reply.getQuery().getQueryId())
                .orElseThrow(() -> new RuntimeException("Query not found"));

        if (!query.getSubjectName().equalsIgnoreCase(reply.getSubjectName())) {
            throw new RuntimeException("Subject does not match the query's subject");
        }

        reply.setQuery(query);
        Reply saved = replyRepository.save(reply);

        // set learner name for response
        learnerRepository.findById(reply.getLearnerId())
                .ifPresent(l -> saved.setLearnerName(l.getName()));

        return saved;
    }

    public List<Reply> getReplyBySubject(String subjectName) {
        List<Reply> replies = replyRepository.findBySubjectName(subjectName);
        replies.forEach(r -> learnerRepository.findById(r.getLearnerId())
                .ifPresent(l -> r.setLearnerName(l.getName())));
        return replies;
    }
    public void deleteReply(int replyId, int learnerId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        if (reply.getLearnerId() != learnerId) {
            throw new RuntimeException("You are not authorized to delete this reply");
        }

        replyRepository.deleteById(replyId);
    }
}