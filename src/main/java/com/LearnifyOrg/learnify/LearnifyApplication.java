package com.LearnifyOrg.learnify;

import com.LearnifyOrg.learnify.Controller.LearnerController;
import com.LearnifyOrg.learnify.Repository.LearnerRepository;
import com.LearnifyOrg.learnify.Services.LearnerServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LearnifyApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(LearnifyApplication.class, args);
	}
	@Autowired
	private LearnerRepository learnerRepository;

	@Override
	public void run(String... args) throws Exception {

	}
}

