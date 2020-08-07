package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.Finding;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Finding} entity.
 */
public interface FindingSearchRepository extends ElasticsearchRepository<Finding, Long> {
}
