package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.ActionFinding;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Spring Data  repository for the ActionFinding entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActionFindingRepository extends JpaRepository<ActionFinding, Long> {

      @Query(value = "select * from action_finding where action_finding.act_finding_id = ?1 order by id asc", nativeQuery = true)
      Page<ActionFinding> findByActFinding_Id(long id, Pageable page);

}
