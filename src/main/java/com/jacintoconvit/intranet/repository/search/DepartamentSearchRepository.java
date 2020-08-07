package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.Departament;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Departament} entity.
 */
public interface DepartamentSearchRepository extends ElasticsearchRepository<Departament, Long> {
}
