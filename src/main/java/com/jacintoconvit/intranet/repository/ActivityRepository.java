package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.Activity;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
/**
 * Spring Data  repository for the Activity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("select activity from Activity activity where activity.creator.login = ?#{principal.username}")
    List<Activity> findByCreatorIsCurrentUser();

    Page<Activity> findByDateStartGreaterThanEqualAndDateLimitLessThanEqualAndStatusEquals(LocalDate starDate, LocalDate dateEnd, int status, Pageable pageable);

    Page<Activity> findByDateStartGreaterThanEqualAndDateLimitLessThanEqual(LocalDate starDate, LocalDate dateEnd, Pageable pageable);

    Page<Activity> findByDateLimitLessThanEqualAndStatusEquals(LocalDate dateEnd, int status, Pageable pageable);

    Page<Activity> findByDateStartGreaterThanEqualAndStatusEquals(LocalDate starDate, int status, Pageable pageable);

    Page<Activity> findByDateStartGreaterThanEqual(LocalDate starDate, Pageable pageable);

    Page<Activity> findByDateLimitLessThanEqual(LocalDate dateEnd, Pageable pageable);

    Page<Activity> findByStatusEquals(int status, Pageable pageable);
}
