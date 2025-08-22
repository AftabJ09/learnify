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

    public Admin addAdmin(Admin admin) {
        String predefinedPasscode = "123456789"; // 🔑 predefined

        // ✅ Validate passcode
        if (!predefinedPasscode.equals(admin.getPasscode())) {
            throw new RuntimeException("Invalid Admin Passcode!");
        }

        // ✅ Check for existing email before saving
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Admin with this email already exists!");
        }

        // Do not store passcode in DB (if you want it global only)
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