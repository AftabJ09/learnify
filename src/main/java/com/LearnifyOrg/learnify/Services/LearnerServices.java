package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Entity.Learner;
import com.LearnifyOrg.learnify.Repository.LearnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearnerServices {
    @Autowired
    private LearnerRepository learnerRepository;

    public List<Learner> getAllLearnerDetails() {
        return learnerRepository.findAll();
    }

    public Learner addLearner(Learner learner) {
        if (learnerRepository.existsByEmail(learner.getEmail())) {
            throw new RuntimeException("Email already registered!");  // or custom exception
        }
        return learnerRepository.save(learner);
    }

    public Learner updateLearner(Learner learner, int learnerId) {
        Learner learner1 = learnerRepository.findById(learnerId).orElse(null);
        if (learner1 != null) {
            learner1.setName(learner.getName());
            learner1.setEmail(learner.getEmail());
            learner1.setPassword(learner.getPassword());
            return learnerRepository.save(learner1);
        }
        return null;
    }

    public Learner deleteLearner(int learnerId) {
        Learner learner2=learnerRepository.findById(learnerId).orElse(null);
        if (learner2 != null){
            learnerRepository.delete(learner2);
        }
        return learner2;
    }

    public boolean learnerExistsByEmail(String email) {
        return learnerRepository.existsByEmail(email);
    }

    public Learner validateLearner(String email, String password) {
        // Loop through all learners and check email + password match
        for (Learner learner : learnerRepository.findAll()) {
            if (learner.getEmail().equalsIgnoreCase(email) && learner.getPassword().equals(password)) {
                return learner; // Match found
            }
        }
        return null; // No match found
    }
}

