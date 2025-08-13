package com.LearnifyOrg.learnify.Controller;

import com.LearnifyOrg.learnify.Entity.Learner;
import com.LearnifyOrg.learnify.Repository.LearnerRepository;
import com.LearnifyOrg.learnify.Services.LearnerServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learner")
public class LearnerController {
    @Autowired
    public LearnerServices learnerServices;

    @GetMapping("/fetch")
    public ResponseEntity<List<Learner>> getAllLearnerDetails() {
        return ResponseEntity.ok(learnerServices.getAllLearnerDetails());
    }

    @PostMapping
    public ResponseEntity<Learner> addLearner(@RequestBody Learner learner) {
        return ResponseEntity.ok(learnerServices.addLearner(learner));
    }

    @PutMapping("/{learner_id}")
    public ResponseEntity<Learner> updateLearner(@PathVariable int learner_id, @RequestBody Learner learner) {
        return ResponseEntity.ok(learnerServices.updateLearner(learner, learner_id));
    }

    @DeleteMapping("/{learner_id}")
    public ResponseEntity<Learner> deleteLearner(@PathVariable int learner_id) {
        return ResponseEntity.ok(learnerServices.deleteLearner(learner_id));
    }
}
