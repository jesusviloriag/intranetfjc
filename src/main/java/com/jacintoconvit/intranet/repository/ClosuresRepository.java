package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.Closures;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Spring Data  repository for the Closures entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClosuresRepository extends JpaRepository<Closures, Long> {

  @Query(value = "select * from closures where closures.find_close_id = ?1", nativeQuery = true)
  Page<Closures> findByIdFinding(long id, Pageable page);
}
