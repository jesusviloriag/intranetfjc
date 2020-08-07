package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.Document;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Document} entity.
 */
public interface DocumentSearchRepository extends ElasticsearchRepository<Document, Long> {
}
