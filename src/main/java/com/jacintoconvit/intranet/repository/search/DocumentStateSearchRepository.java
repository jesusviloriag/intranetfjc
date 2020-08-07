package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.DocumentState;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link DocumentState} entity.
 */
public interface DocumentStateSearchRepository extends ElasticsearchRepository<DocumentState, Long> {
}
