package com.jacintoconvit.intranet.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.jacintoconvit.intranet.web.rest.TestUtil;

public class DocumentStateTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentState.class);
        DocumentState documentState1 = new DocumentState();
        documentState1.setId(1L);
        DocumentState documentState2 = new DocumentState();
        documentState2.setId(documentState1.getId());
        assertThat(documentState1).isEqualTo(documentState2);
        documentState2.setId(2L);
        assertThat(documentState1).isNotEqualTo(documentState2);
        documentState1.setId(null);
        assertThat(documentState1).isNotEqualTo(documentState2);
    }
}
