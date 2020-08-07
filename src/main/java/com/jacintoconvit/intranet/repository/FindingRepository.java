package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.Finding;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.*;
import java.lang.*;
/**
 * Spring Data  repository for the Finding entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FindingRepository extends JpaRepository<Finding, Long> {

  @Query("select finding from Finding finding where finding.creator.login = ?#{principal.username}")
  List<Finding> findByCreatorIsCurrentUser();

  Page<Finding>findByDateStartGreaterThanEqualAndDateEndLessThanEqualAndDeptInvolEquals(LocalDate starDate, LocalDate dateEnd, int dpte, Pageable pageable);

  Page<Finding>findByDateStartGreaterThanEqualAndDeptInvolEquals(LocalDate starDate, int dpte, Pageable pageable);

  Page<Finding>findByDateEndLessThanEqualAndDeptInvolEquals(LocalDate dateEnd, int dpte, Pageable pageable);

  Page<Finding>findByDateStartGreaterThanEqualAndDateClosureNotNullAndDeptInvolEquals(LocalDate starDate,  int dpte,Pageable pageable);

  Page<Finding>findByDateEndLessThanEqualAndDateClosureNotNullAndDeptInvolEquals(LocalDate dateEnd,  int dpte,Pageable pageable);

  Page<Finding>findByDateStartGreaterThanEqualAndDateClosureIsNullAndDeptInvolEquals(LocalDate starDate,  int dpte,Pageable pageable);

  Page<Finding>findByDateEndLessThanEqualAndDateClosureIsNullAndDeptInvolEquals(LocalDate starDate, int dpte, Pageable pageable);

  Page<Finding>findByDateStartGreaterThanEqualAndDateEndLessThanEqualAndDateClosureNotNullAndDeptInvolEquals(LocalDate starDate, LocalDate dateEnd, int dpte, Pageable pageable);

  Page<Finding>findByDateStartGreaterThanEqualAndDateEndLessThanEqualAndDateClosureIsNullAndDeptInvolEquals(LocalDate starDate, LocalDate dateEnd, int dpte, Pageable pageable);

  Page<Finding>findByDateClosureNotNullAndDeptInvolEquals( int dpte,Pageable pageable);

  Page<Finding>findByDateClosureIsNullAndDeptInvolEquals( int dpte,Pageable pageable);

  Page<Finding>findByDeptInvolEquals(int dpte,Pageable pageable);
}
