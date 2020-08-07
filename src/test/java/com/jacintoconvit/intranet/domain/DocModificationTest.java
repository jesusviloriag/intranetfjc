package com.jacintoconvit.intranet.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.jacintoconvit.intranet.web.rest.TestUtil;

public class DocModificationTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocModification.class);
        DocModification docModification1 = new DocModification();
        docModification1.setId(1L);
        DocModification docModification2 = new DocModification();
        docModification2.setId(docModification1.getId());
        assertThat(docModification1).isEqualTo(docModification2);
        docModification2.setId(2L);
        assertThat(docModification1).isNotEqualTo(docModification2);
        docModification1.setId(null);
        assertThat(docModification1).isNotEqualTo(docModification2);
    }
}
