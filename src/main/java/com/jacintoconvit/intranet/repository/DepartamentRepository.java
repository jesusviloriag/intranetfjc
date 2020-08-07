package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.Departament;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Departament entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DepartamentRepository extends JpaRepository<Departament, Long> {

}
