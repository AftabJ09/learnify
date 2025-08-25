package com.LearnifyOrg.learnify.Services;
import com.LearnifyOrg.learnify.Entity.TopicContent;
import com.LearnifyOrg.learnify.Repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicServices {
    @Autowired
    private TopicRepository topicRepository;

    public List<TopicContent> getAllTopicContent() {
        return topicRepository.findAll();
    }

}
