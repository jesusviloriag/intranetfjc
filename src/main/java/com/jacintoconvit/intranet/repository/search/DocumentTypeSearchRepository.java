package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.DocumentType;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link DocumentType} entity.
 */
public interface DocumentTypeSearchRepository extends ElasticsearchRepository<DocumentType, Long> {
}
