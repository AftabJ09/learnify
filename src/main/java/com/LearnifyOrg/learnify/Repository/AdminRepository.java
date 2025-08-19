package com.LearnifyOrg.learnify.Repository;

import com.LearnifyOrg.learnify.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Integer> {
}
