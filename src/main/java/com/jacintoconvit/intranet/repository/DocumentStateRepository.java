package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.DocumentState;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the DocumentState entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentStateRepository extends JpaRepository<DocumentState, Long> {

}
