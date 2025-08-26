package com.LearnifyOrg.learnify.Controller;
import com.LearnifyOrg.learnify.Entity.Sections;
import com.LearnifyOrg.learnify.Entity.TopicContent;
import com.LearnifyOrg.learnify.Services.TopicServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/TopicContent")
public class TopicController {
    @Autowired
    private TopicServices topicServices;

    @PostMapping(value = "/upload", consumes = "application/json", produces = "application/json")
    public ResponseEntity<TopicContent> insertData(@RequestBody TopicContent topicContent){
        System.out.println("Received TopicContent: " + topicContent);
        return ResponseEntity.ok(topicServices.insertdata(topicContent));

    }
}


