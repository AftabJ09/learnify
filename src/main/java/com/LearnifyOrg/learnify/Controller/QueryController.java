package com.LearnifyOrg.learnify.Controller;

import com.LearnifyOrg.learnify.Entity.Query;
import com.LearnifyOrg.learnify.Services.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/queries")
public class QueryController {

        @Autowired
        private QueryService queryService;

        @PostMapping("/add")
        public ResponseEntity<Query> addQuery(@RequestBody Query query) {
            return ResponseEntity.ok(queryService.addQuery(query));
        }

        @DeleteMapping("/delete/{queryId}")
        public ResponseEntity<String> deleteQuery(
                @PathVariable int queryId,
                @RequestParam int learnerId) {
            try {
                queryService.deleteQuery(queryId, learnerId);
                return ResponseEntity.ok("Query deleted");
            } catch (RuntimeException e) {
                return ResponseEntity.status(403).body(e.getMessage());
            }
        }

        @GetMapping("/subject/{subjectName}")
        public List<Query> getQueriesBySubject(@PathVariable String subjectName) {
            return queryService.getQueriesBySubject(subjectName);
        }
    }