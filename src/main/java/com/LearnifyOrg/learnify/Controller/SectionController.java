package com.LearnifyOrg.learnify.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.LearnifyOrg.learnify.Entity.Sections;
import com.LearnifyOrg.learnify.Services.SectionServices;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Sections")
public class SectionController {
    @Autowired
    private SectionServices sectionServices;
    @GetMapping("/All_Sections")
    public ResponseEntity<List<Sections>> getSectionsData(){
        return ResponseEntity.ok(sectionServices.getSectionsData());
    }

    @GetMapping("/SectionsBySubject/{subjectId}")
    public ResponseEntity<List<Sections>> getSectionsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(sectionServices.getSectionsBySubjectId(subjectId));
    }

    @PostMapping("/AddSection")
    public ResponseEntity<Sections> addSection(@RequestBody Map<String, Object> body) {
        String sectionName = (String) body.get("sectionName");
        Long subjectId = Long.valueOf(String.valueOf(body.get("subjectId")));
        return ResponseEntity.ok(sectionServices.addSection(sectionName, subjectId));
    }


    @DeleteMapping("/DeleteSection/{sectionId}")
    public ResponseEntity<String> deleteSubject(@PathVariable Long sectionId){
        sectionServices.deleteSection(sectionId);
        return ResponseEntity.ok("Section deleted successfully with id" +sectionId);
    }
    @PutMapping("/EditSection/{sectionId}")
    public ResponseEntity<Sections> editSectionName(@PathVariable Long sectionId,
                                                    @RequestBody Map<String, String> body) {
        String newName = body.get("sectionName"); // read from JSON
        return ResponseEntity.ok(sectionServices.editSectionName(sectionId, newName));
    }

}
