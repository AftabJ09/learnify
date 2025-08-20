package com.LearnifyOrg.learnify.Services;

import com.LearnifyOrg.learnify.Entity.Admin;
import com.LearnifyOrg.learnify.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServices {

    @Autowired
    private AdminRepository adminRepository;

    // 🔑 Common passcode (can be changed only in backend code)
    private static final String COMMON_PASSCODE = "123456789";

    public List<Admin> getAllAdminDetails() {
        return adminRepository.findAll();
    }

    // ✅ Add new admin (signup) with common passcode check
    public Admin addAdmin(Admin admin) {
        if (!COMMON_PASSCODE.equals(admin.getPasscode())) {
            throw new RuntimeException("Invalid Admin Passcode!");
        }

        // Do not store passcode in DB since it's common
        admin.setPasscode(null);

        return adminRepository.save(admin);
    }

    public Admin updateAdminDetails(Admin admin, int admin_id) {
        Admin existingAdmin = adminRepository.findById(admin_id).orElseThrow(
                () -> new RuntimeException("Admin not found with ID: " + admin_id)
        );

        existingAdmin.setName(admin.getName());
        existingAdmin.setEmail(admin.getEmail());
        existingAdmin.setPassword(admin.getPassword());

        return adminRepository.save(existingAdmin);
    }

    public void deleteAdmin(int admin_id) {
        if (!adminRepository.existsById(admin_id)) {
            throw new RuntimeException("Admin not found with ID: " + admin_id);
        }
        adminRepository.deleteById(admin_id);
    }
}