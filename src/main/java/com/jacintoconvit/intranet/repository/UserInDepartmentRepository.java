package com.jacintoconvit.intranet.repository;
import com.jacintoconvit.intranet.domain.UserInDepartment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the UserInDepartment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserInDepartmentRepository extends JpaRepository<UserInDepartment, Long> {

    @Query("select userInDepartment from UserInDepartment userInDepartment where userInDepartment.user.login = ?#{principal.username}")
    List<UserInDepartment> findByUserIsCurrentUser();

    List<UserInDepartment> findByUser_Id(Long id);

}
