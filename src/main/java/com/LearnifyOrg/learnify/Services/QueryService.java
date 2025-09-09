package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Entity.Query;
import com.LearnifyOrg.learnify.Entity.Subjects;
import com.LearnifyOrg.learnify.Entity.Subjects;
import com.LearnifyOrg.learnify.Repository.LearnerRepository;
import com.LearnifyOrg.learnify.Repository.QueryRepository;
import com.LearnifyOrg.learnify.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Objects;

import java.util.List;

@Service
public class QueryService {

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private LearnerRepository learnerRepository; // fetch learner names

    public Query addQuery(Query query) {
        return queryRepository.save(query);
    }

    public void deleteQuery(int queryId, int learnerId) {
        Query q = queryRepository.findById(queryId).orElse(null);
        if(q != null && q.getLearnerId() == learnerId) {
            queryRepository.delete(q);
        } else {
            throw new RuntimeException("You cannot delete this query.");
        }
    }

    public List<Query> getQueriesBySubject(String subjectName) {
        List<Query> queries = queryRepository.findBySubjectName(subjectName);
        queries.forEach(q -> {
            learnerRepository.findById(q.getLearnerId())
                    .ifPresent(l -> q.setLearnerName(l.getName()));
        });
        return queries;
    }
}