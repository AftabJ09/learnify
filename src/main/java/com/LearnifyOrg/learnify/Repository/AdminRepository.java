package com.LearnifyOrg.learnify.Repository;

import com.LearnifyOrg.learnify.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    boolean existsByEmail(String email);

    // ✅ corrected field name to match entity (passcode, not passkey)
    Admin findByEmailAndPasswordAndPasscode(String email, String password, String passcode);
}
