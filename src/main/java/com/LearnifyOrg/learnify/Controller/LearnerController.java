package com.LearnifyOrg.learnify.Controller;
import com.LearnifyOrg.learnify.Entity.Learner;
import com.LearnifyOrg.learnify.Services.LearnerServices;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/learner")
@CrossOrigin(origins = "http://localhost:5500")
public class LearnerController {
    @Autowired
    public LearnerServices learnerServices;

    @GetMapping("/fetch")
    public ResponseEntity<List<Learner>> getAllLearnerDetails() {
        return ResponseEntity.ok(learnerServices.getAllLearnerDetails());
    }

    @PostMapping
    public ResponseEntity<?> addLearner(@RequestBody Learner learner) {
        try {
            Learner savedLearner = learnerServices.addLearner(learner);
            return ResponseEntity.ok(savedLearner);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // 409 Conflict
        }
    }

    @PutMapping("/{learner_id}")
    public ResponseEntity<Learner> updateLearner(@PathVariable int learner_id, @RequestBody Learner learner) {
        return ResponseEntity.ok(learnerServices.updateLearner(learner, learner_id));
    }

    @DeleteMapping("/{learner_id}")
    public ResponseEntity<Learner> deleteLearner(@PathVariable int learner_id) {
        return ResponseEntity.ok(learnerServices.deleteLearner(learner_id));
    }

    @GetMapping("/exists/{email}")
    public ResponseEntity<Map<String, Object>> checkLearnerExists(@PathVariable String email) {
        boolean exists = learnerServices.learnerExistsByEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("email", email);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginLearner(@RequestBody Map<String, String> payload, HttpSession session) {

        String email = payload.get("email");
        String password = payload.get("password");

        Map<String, Object> response = new HashMap<>();

        if (email == null || password == null) {
            response.put("success", false);
            response.put("message", "Email and password are required");
            return ResponseEntity.badRequest().body(response);
        }

        Learner learner = learnerServices.validateLearner(email, password);

        if (learner != null) {
            // Set session here
            session.setAttribute("learnerId", learner.getLearner_Id());
            session.setAttribute("learnerEmail", learner.getEmail());
            session.setAttribute("learnerName", learner.getName());

            response.put("success", true);
            response.put("learner_name", learner.getName());
            response.put("learnerId", learner.getLearner_Id());
            response.put("learner_email", learner.getEmail());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> getSession(HttpSession session) {
        Map<String, Object> sessionData = new HashMap<>();

        if (session.getAttribute("learnerId") != null) {
            sessionData.put("loggedIn", true);
            sessionData.put("learnerId", session.getAttribute("learnerId"));
            sessionData.put("learnerEmail", session.getAttribute("learnerEmail"));
            sessionData.put("learnerName", session.getAttribute("learnerName"));
        } else {
            sessionData.put("loggedIn", false);
        }

        return ResponseEntity.ok(sessionData);
    }

    // Logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate(); // clears the session
        return ResponseEntity.ok().build();
    }
}


