package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.Closures;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Closures} entity.
 */
public interface ClosuresSearchRepository extends ElasticsearchRepository<Closures, Long> {
}
