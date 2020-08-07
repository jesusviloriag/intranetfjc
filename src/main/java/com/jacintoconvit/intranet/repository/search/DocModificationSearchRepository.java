package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.DocModification;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link DocModification} entity.
 */
public interface DocModificationSearchRepository extends ElasticsearchRepository<DocModification, Long> {
}
