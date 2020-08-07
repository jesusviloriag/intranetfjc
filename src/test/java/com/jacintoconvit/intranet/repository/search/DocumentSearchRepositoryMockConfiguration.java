package com.jacintoconvit.intranet.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link DocumentSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class DocumentSearchRepositoryMockConfiguration {

    @MockBean
    private DocumentSearchRepository mockDocumentSearchRepository;

}
