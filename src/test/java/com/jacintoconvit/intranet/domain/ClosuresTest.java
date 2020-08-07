package com.jacintoconvit.intranet.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.jacintoconvit.intranet.web.rest.TestUtil;

public class ClosuresTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Closures.class);
        Closures closures1 = new Closures();
        closures1.setId(1L);
        Closures closures2 = new Closures();
        closures2.setId(closures1.getId());
        assertThat(closures1).isEqualTo(closures2);
        closures2.setId(2L);
        assertThat(closures1).isNotEqualTo(closures2);
        closures1.setId(null);
        assertThat(closures1).isNotEqualTo(closures2);
    }
}
