package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Repository.LearnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LearnerServices {
    @Autowired
    private LearnerRepository learnerRepository;
}
