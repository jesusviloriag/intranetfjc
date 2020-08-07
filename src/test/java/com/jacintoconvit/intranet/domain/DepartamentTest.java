package com.jacintoconvit.intranet.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.jacintoconvit.intranet.web.rest.TestUtil;

public class DepartamentTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Departament.class);
        Departament departament1 = new Departament();
        departament1.setId(1L);
        Departament departament2 = new Departament();
        departament2.setId(departament1.getId());
        assertThat(departament1).isEqualTo(departament2);
        departament2.setId(2L);
        assertThat(departament1).isNotEqualTo(departament2);
        departament1.setId(null);
        assertThat(departament1).isNotEqualTo(departament2);
    }
}
