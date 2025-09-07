package com.LearnifyOrg.learnify.Controller;

import com.LearnifyOrg.learnify.Entity.Admin;
import com.LearnifyOrg.learnify.Services.AdminServices;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:63342", allowCredentials = "true") // allow cookies/sessions
public class AdminController {

    @Autowired
    private AdminServices adminServices;

    // ✅ Fetch all admins
    @GetMapping("/fetch")
    public ResponseEntity<List<Admin>> getAllAdminDetails() {
        return ResponseEntity.ok(adminServices.getAllAdminDetails());
    }

    // ✅ Add new admin
    @PostMapping("/addAdmin")
    public ResponseEntity<Admin> addAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminServices.addAdmin(admin));
    }

    // ✅ Update admin
    @PutMapping("/{admin_id}")
    public ResponseEntity<Admin> updateAdminDetails(@RequestBody Admin admin, @PathVariable int admin_id) {
        return ResponseEntity.ok(adminServices.updateAdminDetails(admin, admin_id));
    }

    // ✅ Delete admin
    @DeleteMapping("/{admin_id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable int admin_id) {
        adminServices.deleteAdmin(admin_id);
        return ResponseEntity.ok("Admin deleted successfully with ID: " + admin_id);
    }

    // ✅ Admin Login Validation (with passcode)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginAdmin(@RequestBody Map<String, String> payload, HttpSession session) {
        String email = payload.get("email");
        String password = payload.get("password");
        String passcode = payload.get("passcode");

        Map<String, Object> response = new HashMap<>();

        if (email == null || password == null || passcode == null) {
            response.put("success", false);
            response.put("message", "Email, password, and passcode are required.");
            return ResponseEntity.badRequest().body(response);
        }

        Admin admin = adminServices.validateAdmin(email, password, passcode);

        if (admin != null) {
            session.setAttribute("adminId", admin.getAdmin_Id());  // ✅ matches entity field
            session.setAttribute("adminEmail", admin.getEmail());
            session.setAttribute("adminName", admin.getName());

            response.put("success", true);
            response.put("admin_name", admin.getName());
            response.put("adminId", admin.getAdmin_Id());
            response.put("admin_email", admin.getEmail());

            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid email, password, or passcode.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // ✅ Session check
    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> getAdminSession(HttpSession session) {
        Map<String, Object> sessionData = new HashMap<>();
        if (session.getAttribute("adminId") != null) {
            sessionData.put("loggedIn", true);
            sessionData.put("adminId", session.getAttribute("adminId"));
            sessionData.put("adminEmail", session.getAttribute("adminEmail"));
            sessionData.put("adminName", session.getAttribute("adminName"));
        } else {
            sessionData.put("loggedIn", false);
        }
        return ResponseEntity.ok(sessionData);
    }

    // ✅ Logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }
}
