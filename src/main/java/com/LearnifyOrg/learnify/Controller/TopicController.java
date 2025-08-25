package com.LearnifyOrg.learnify.Controller;
import com.LearnifyOrg.learnify.Entity.TopicContent;
import com.LearnifyOrg.learnify.Services.TopicServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/TopicContent")
public class TopicController {
    @Autowired
    private TopicServices topicServices;

}


