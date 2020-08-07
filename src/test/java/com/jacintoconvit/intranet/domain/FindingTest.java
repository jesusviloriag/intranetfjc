package com.jacintoconvit.intranet.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.jacintoconvit.intranet.web.rest.TestUtil;

public class FindingTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Finding.class);
        Finding finding1 = new Finding();
        finding1.setId(1L);
        Finding finding2 = new Finding();
        finding2.setId(finding1.getId());
        assertThat(finding1).isEqualTo(finding2);
        finding2.setId(2L);
        assertThat(finding1).isNotEqualTo(finding2);
        finding1.setId(null);
        assertThat(finding1).isNotEqualTo(finding2);
    }
}
