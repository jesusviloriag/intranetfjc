package com.jacintoconvit.intranet.repository.search;
import com.jacintoconvit.intranet.domain.UserInDepartment;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link UserInDepartment} entity.
 */
public interface UserInDepartmentSearchRepository extends ElasticsearchRepository<UserInDepartment, Long> {
}
