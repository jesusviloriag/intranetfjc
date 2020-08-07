package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.ActionFinding;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ActionFinding} entity.
 */
public interface ActionFindingSearchRepository extends ElasticsearchRepository<ActionFinding, Long> {
}
