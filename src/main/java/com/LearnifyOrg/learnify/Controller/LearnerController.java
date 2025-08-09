package com.LearnifyOrg.learnify.Controller;

import com.LearnifyOrg.learnify.Services.LearnerServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LearnerController {
    @Autowired
    private LearnerServices learnerServices;
}
