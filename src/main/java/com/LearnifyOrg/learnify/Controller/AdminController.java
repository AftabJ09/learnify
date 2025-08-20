package com.LearnifyOrg.learnify.Controller;

import com.LearnifyOrg.learnify.Entity.Admin;
import com.LearnifyOrg.learnify.Services.AdminServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:63342")
public class AdminController {

    @Autowired
    private AdminServices adminServices;

    @GetMapping("/fetch")
    public ResponseEntity<List<Admin>> getAllAdminDetails() {
        return ResponseEntity.ok(adminServices.getAllAdminDetails());
    }

    @PostMapping("/addAdmin")
    public ResponseEntity<Admin> addAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminServices.addAdmin(admin));
    }

    @PutMapping("/{admin_id}")
    public ResponseEntity<Admin> updateAdminDetails(
            @RequestBody Admin admin,
            @PathVariable int admin_id
    ) {
        return ResponseEntity.ok(adminServices.updateAdminDetails(admin, admin_id));
    }

    @DeleteMapping("/{admin_id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable int admin_id) {
        adminServices.deleteAdmin(admin_id);
        return ResponseEntity.ok("Admin deleted successfully with ID: " + admin_id);
    }
}