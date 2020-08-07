package com.jacintoconvit.intranet.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.jacintoconvit.intranet.web.rest.TestUtil;

public class UserInDepartmentTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserInDepartment.class);
        UserInDepartment userInDepartment1 = new UserInDepartment();
        userInDepartment1.setId(1L);
        UserInDepartment userInDepartment2 = new UserInDepartment();
        userInDepartment2.setId(userInDepartment1.getId());
        assertThat(userInDepartment1).isEqualTo(userInDepartment2);
        userInDepartment2.setId(2L);
        assertThat(userInDepartment1).isNotEqualTo(userInDepartment2);
        userInDepartment1.setId(null);
        assertThat(userInDepartment1).isNotEqualTo(userInDepartment2);
    }
}
