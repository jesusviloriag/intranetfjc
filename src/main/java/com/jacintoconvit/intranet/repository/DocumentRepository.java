package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data  repository for the Document entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Query("select document from Document document where document.creator.login = ?#{principal.username}")
    List<Document> findByCreatorIsCurrentUser();

    Page findByDateCreationLessThanEqualAndDepartament_IdEquals(LocalDate date1, Long dpte, Pageable pageable);

    Page findByDateCreationLessThanEqualAndState_IdEqualsAndDepartament_IdEquals(LocalDate date1, Long status, Long dpte, Pageable pageable);

    Page findByState_IdEqualsAndDepartament_IdEquals(Long status, Long dpte, Pageable pageable);
    
    Page findByDepartament_IdEquals(Long dpte, Pageable pageable);
}
