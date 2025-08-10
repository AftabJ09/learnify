package com.LearnifyOrg.learnify.Controller;

import com.LearnifyOrg.learnify.Entity.Learner;
import com.LearnifyOrg.learnify.Repository.LearnerRepository;
import com.LearnifyOrg.learnify.Services.LearnerServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping()
public class LearnerController {
    @Autowired
    public LearnerRepository LearnerRepository;
    public List<Learner>getAllLearnerdetails()
    {
        return LearnerRepository .findAll();
    }
    @DeleteMappin("{Learner_Id}")
    public LearnerRepository deleteLea(@PathVariable  int Learner_Id)
    {
        Learner
                Learner_Id1=LearnerRepository.findById(Learner_Id).orElse(null);
        if(Learner_Id1!=nul)
        {
            LearnerRepository.delete(Learner_Id1);
        }

        return Learner_Id1;
    }
    @PutMapping("{Learner_Id}")
    public LearnerupdateL(@PathVariable  int Learner_Id,@RequestBody Learner)
    {
        Learner_Id=LearnerRepository.findById(Learner_Id).orElse(null);
        Learner.SetName(Learner.getName());
        Learner.Setemail(Learner.getName());
        return;LearnerRepository.save(Learner_Id);

    }
}
