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

    public List<Admin> getAllAdminDetails() {
        return adminRepository.findAll();
    }

    public Admin addAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin updateAdminDetails(Admin admin, int adminId) {
        Admin admin1=adminRepository.findById(adminId).orElse(null);
        admin1.setAdmin_Id(admin.getAdmin_Id());
        admin1.setName(admin.getName());
        admin1.setEmail(admin.getEmail());
        admin1.setPassword(admin.getPassword());
        return adminRepository.save(admin1);
    }


    public Admin deleteAdmin(Admin admin, int adminId) {
        Admin admin2=adminRepository.findById(adminId).orElse(null);
        if (admin2 != null){
            adminRepository.delete(admin2);
        }
        return admin2;
    }
}
