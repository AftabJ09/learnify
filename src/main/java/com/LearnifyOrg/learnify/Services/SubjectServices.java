package com.LearnifyOrg.learnify.Services;
import com.LearnifyOrg.learnify.Entity.Subjects;
import com.LearnifyOrg.learnify.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SubjectServices{
    @Autowired
    private SubjectRepository subjectRepository;
    public List<Subjects> getSubjectData() {
            return subjectRepository.findAll();
    }

    public void deleteSubject(Long subjectId){
        if(!subjectRepository.existsById(subjectId)){
            throw new RuntimeException("Subject not found with id" + subjectId);
        }
        subjectRepository.deleteById(subjectId);
    }

    public Subjects addSubject(String subjectName) {
        Subjects subject = new Subjects();
        subject.setSubjectName(subjectName);
        return subjectRepository.save(subject);
    }


    public Subjects editSubject(Long subjectId, String subjectName) {
        Subjects subject = subjectRepository.findById(subjectId).orElseThrow(() -> new RuntimeException("Subject not found"));
        subject.setSubjectName(subjectName);
        return subjectRepository.save(subject);
    }
}
