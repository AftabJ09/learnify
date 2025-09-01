package com.LearnifyOrg.learnify.Controller;
import com.LearnifyOrg.learnify.Entity.Sections;
import com.LearnifyOrg.learnify.Entity.TopicContent;
import com.LearnifyOrg.learnify.Repository.TopicRepository;
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

    @Autowired
    private TopicRepository topicRepository;

    public TopicController(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }
    @GetMapping("/BySection/{section_Id}")
    public List<TopicContent> getTopicsBySection(@PathVariable Long section_Id) {
        return topicRepository.findBySectionsSectionId(section_Id);
    }
    // Get topic by ID
    @GetMapping("/{id}")
    public TopicContent getTopicById(@PathVariable Long id) {
        return topicRepository.findById(id).orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    @PostMapping(value = "/upload", consumes = "application/json", produces = "application/json")
    public ResponseEntity<TopicContent> insertData(@RequestBody TopicContent topicContent){
        System.out.println("Received TopicContent: " + topicContent);
        return ResponseEntity.ok(topicServices.insertdata(topicContent));

    }
    @PutMapping("/{id}")
    public ResponseEntity<TopicContent> updateTopic(@PathVariable Long id,
                                                    @RequestBody TopicContent updatedTopic) {
        TopicContent topic = topicServices.updateTopic(id, updatedTopic);
        return ResponseEntity.ok(topic);
    }

}


