package com.LearnifyOrg.learnify.Services;
import com.LearnifyOrg.learnify.Entity.Sections;
import com.LearnifyOrg.learnify.Entity.Subjects;
import com.LearnifyOrg.learnify.Repository.SectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectionServices {
    @Autowired
    private SectionRepository sectionRepository;
    public List<Sections> getSectionsData() {
        return sectionRepository.findAll();
    }

    public Sections addSection(String sectionName, Long subjectId) {
        Sections section = new Sections();
        section.setSectionName(sectionName);
        Subjects subject = new Subjects();
        subject.setSubjectId(subjectId);
        section.setSubjects(subject);
        return sectionRepository.save(section);
    }


    @Transactional
    public void deleteSection(Long sectionId) {
        if(!sectionRepository.existsById(sectionId)) {
            throw new RuntimeException("Section not found with id " + sectionId);
        }
        sectionRepository.deleteById(sectionId);
    }


    @Transactional
    public Sections editSectionName(Long sectionId, String newName) {
        Sections section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found with id " + sectionId));

        section.setSectionName(newName); // update the name
        return sectionRepository.save(section);
    }

    public List<Sections> getSectionsBySubjectId(Long subjectId) {
        return sectionRepository.findBySubjectsSubjectId(subjectId);
    }
}
