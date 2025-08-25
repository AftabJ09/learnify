package com.LearnifyOrg.learnify.Controller;
import com.LearnifyOrg.learnify.Entity.Subjects;
import com.LearnifyOrg.learnify.Services.SubjectServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/Subjects")
public class SubjectController {

    @Autowired
    private SubjectServices subjectServices;
    @GetMapping("/All_Subjects")
    public ResponseEntity<List<Subjects>> getSubjectData(){
        return ResponseEntity.ok(subjectServices.getSubjectData());
    }

    @DeleteMapping("/DeleteSubject/{subjectId}")
    public ResponseEntity<String> deleteSubject(@PathVariable Long subjectId){
        subjectServices.deleteSubject(subjectId);
        return ResponseEntity.ok("Subject deleted successfully with id" +subjectId);
    }

    @PostMapping("/AddSubject")
    public ResponseEntity<Subjects> addSubject(@RequestBody Subjects subject){
        return ResponseEntity.ok(subjectServices.addSubject(subject.getSubjectName()));
    }

    @PutMapping("/EditName/{subjectId}")
    public ResponseEntity<Subjects> editSubject(@PathVariable Long subjectId, @RequestBody Subjects subject){
        String newName = subject.getSubjectName();
        return ResponseEntity.ok(subjectServices.editSubject(subjectId, newName));
    }


}
