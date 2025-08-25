package com.LearnifyOrg.learnify.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.LearnifyOrg.learnify.Entity.Subjects;
@Repository
public interface SubjectRepository extends JpaRepository<Subjects,Long>{

}
