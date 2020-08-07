package com.jacintoconvit.intranet.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.jacintoconvit.intranet.web.rest.TestUtil;

public class ActionFindingTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActionFinding.class);
        ActionFinding actionFinding1 = new ActionFinding();
        actionFinding1.setId(1L);
        ActionFinding actionFinding2 = new ActionFinding();
        actionFinding2.setId(actionFinding1.getId());
        assertThat(actionFinding1).isEqualTo(actionFinding2);
        actionFinding2.setId(2L);
        assertThat(actionFinding1).isNotEqualTo(actionFinding2);
        actionFinding1.setId(null);
        assertThat(actionFinding1).isNotEqualTo(actionFinding2);
    }
}
