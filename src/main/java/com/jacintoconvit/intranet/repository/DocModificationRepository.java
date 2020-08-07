package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.DocModification;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Spring Data  repository for the DocModification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocModificationRepository extends JpaRepository<DocModification, Long> {

    @Query("select docModification from DocModification docModification where docModification.author.login = ?#{principal.username}")
    List<DocModification> findByAuthorIsCurrentUser();

     @Query(value = "select * from doc_modification where doc_modification.doc_mod_id = ?1 order by id desc", nativeQuery = true)
      Page<DocModification> findByDocModification(long id, Pageable page);

      Page<DocModification> findByDocModId(long id, Pageable page);
}
