package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.Activity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Activity} entity.
 */
public interface ActivitySearchRepository extends ElasticsearchRepository<Activity, Long> {
}
