package com.LearnifyOrg.learnify.Controller;

import com.LearnifyOrg.learnify.Entity.Reply;
import com.LearnifyOrg.learnify.Services.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reply")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    // Add reply
    @PostMapping("/add")
    public ResponseEntity<Reply> addReply(@RequestBody Reply reply) {
        return ResponseEntity.ok(replyService.addReply(reply));
    }

    // Get replies by subject
    @GetMapping("/subject/{subjectName}")
    public List<Reply> getReplyBySubject(@PathVariable String subjectName) {
        return replyService.getReplyBySubject(subjectName);
    }

    // Delete reply
    @DeleteMapping("/delete/{replyId}")
    public ResponseEntity<String> deleteReply(
            @PathVariable int replyId,
            @RequestParam int learnerId) {
        try {
            replyService.deleteReply(replyId, learnerId);
            return ResponseEntity.ok("Reply deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}