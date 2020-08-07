package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.UserInDepartment;
import com.jacintoconvit.intranet.domain.User;
import com.jacintoconvit.intranet.domain.Departament;
import com.jacintoconvit.intranet.repository.UserInDepartmentRepository;
import com.jacintoconvit.intranet.repository.search.UserInDepartmentSearchRepository;
import com.jacintoconvit.intranet.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static com.jacintoconvit.intranet.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link UserInDepartmentResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class UserInDepartmentResourceIT {

    @Autowired
    private UserInDepartmentRepository userInDepartmentRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.UserInDepartmentSearchRepositoryMockConfiguration
     */
    @Autowired
    private UserInDepartmentSearchRepository mockUserInDepartmentSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restUserInDepartmentMockMvc;

    private UserInDepartment userInDepartment;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UserInDepartmentResource userInDepartmentResource = new UserInDepartmentResource(userInDepartmentRepository, mockUserInDepartmentSearchRepository);
        this.restUserInDepartmentMockMvc = MockMvcBuilders.standaloneSetup(userInDepartmentResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserInDepartment createEntity(EntityManager em) {
        UserInDepartment userInDepartment = new UserInDepartment();
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        userInDepartment.setUser(user);
        // Add required entity
        Departament departament;
        if (TestUtil.findAll(em, Departament.class).isEmpty()) {
            departament = DepartamentResourceIT.createEntity(em);
            em.persist(departament);
            em.flush();
        } else {
            departament = TestUtil.findAll(em, Departament.class).get(0);
        }
        userInDepartment.setDepartament(departament);
        return userInDepartment;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserInDepartment createUpdatedEntity(EntityManager em) {
        UserInDepartment userInDepartment = new UserInDepartment();
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        userInDepartment.setUser(user);
        // Add required entity
        Departament departament;
        if (TestUtil.findAll(em, Departament.class).isEmpty()) {
            departament = DepartamentResourceIT.createUpdatedEntity(em);
            em.persist(departament);
            em.flush();
        } else {
            departament = TestUtil.findAll(em, Departament.class).get(0);
        }
        userInDepartment.setDepartament(departament);
        return userInDepartment;
    }

    @BeforeEach
    public void initTest() {
        userInDepartment = createEntity(em);
    }

    @Test
    @Transactional
    public void createUserInDepartment() throws Exception {
        int databaseSizeBeforeCreate = userInDepartmentRepository.findAll().size();

        // Create the UserInDepartment
        restUserInDepartmentMockMvc.perform(post("/api/user-in-departments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userInDepartment)))
            .andExpect(status().isCreated());

        // Validate the UserInDepartment in the database
        List<UserInDepartment> userInDepartmentList = userInDepartmentRepository.findAll();
        assertThat(userInDepartmentList).hasSize(databaseSizeBeforeCreate + 1);
        UserInDepartment testUserInDepartment = userInDepartmentList.get(userInDepartmentList.size() - 1);

        // Validate the UserInDepartment in Elasticsearch
        verify(mockUserInDepartmentSearchRepository, times(1)).save(testUserInDepartment);
    }

    @Test
    @Transactional
    public void createUserInDepartmentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userInDepartmentRepository.findAll().size();

        // Create the UserInDepartment with an existing ID
        userInDepartment.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserInDepartmentMockMvc.perform(post("/api/user-in-departments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userInDepartment)))
            .andExpect(status().isBadRequest());

        // Validate the UserInDepartment in the database
        List<UserInDepartment> userInDepartmentList = userInDepartmentRepository.findAll();
        assertThat(userInDepartmentList).hasSize(databaseSizeBeforeCreate);

        // Validate the UserInDepartment in Elasticsearch
        verify(mockUserInDepartmentSearchRepository, times(0)).save(userInDepartment);
    }


    @Test
    @Transactional
    public void getAllUserInDepartments() throws Exception {
        // Initialize the database
        userInDepartmentRepository.saveAndFlush(userInDepartment);

        // Get all the userInDepartmentList
        restUserInDepartmentMockMvc.perform(get("/api/user-in-departments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userInDepartment.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getUserInDepartment() throws Exception {
        // Initialize the database
        userInDepartmentRepository.saveAndFlush(userInDepartment);

        // Get the userInDepartment
        restUserInDepartmentMockMvc.perform(get("/api/user-in-departments/{id}", userInDepartment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(userInDepartment.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingUserInDepartment() throws Exception {
        // Get the userInDepartment
        restUserInDepartmentMockMvc.perform(get("/api/user-in-departments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserInDepartment() throws Exception {
        // Initialize the database
        userInDepartmentRepository.saveAndFlush(userInDepartment);

        int databaseSizeBeforeUpdate = userInDepartmentRepository.findAll().size();

        // Update the userInDepartment
        UserInDepartment updatedUserInDepartment = userInDepartmentRepository.findById(userInDepartment.getId()).get();
        // Disconnect from session so that the updates on updatedUserInDepartment are not directly saved in db
        em.detach(updatedUserInDepartment);

        restUserInDepartmentMockMvc.perform(put("/api/user-in-departments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUserInDepartment)))
            .andExpect(status().isOk());

        // Validate the UserInDepartment in the database
        List<UserInDepartment> userInDepartmentList = userInDepartmentRepository.findAll();
        assertThat(userInDepartmentList).hasSize(databaseSizeBeforeUpdate);
        UserInDepartment testUserInDepartment = userInDepartmentList.get(userInDepartmentList.size() - 1);

        // Validate the UserInDepartment in Elasticsearch
        verify(mockUserInDepartmentSearchRepository, times(1)).save(testUserInDepartment);
    }

    @Test
    @Transactional
    public void updateNonExistingUserInDepartment() throws Exception {
        int databaseSizeBeforeUpdate = userInDepartmentRepository.findAll().size();

        // Create the UserInDepartment

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserInDepartmentMockMvc.perform(put("/api/user-in-departments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userInDepartment)))
            .andExpect(status().isBadRequest());

        // Validate the UserInDepartment in the database
        List<UserInDepartment> userInDepartmentList = userInDepartmentRepository.findAll();
        assertThat(userInDepartmentList).hasSize(databaseSizeBeforeUpdate);

        // Validate the UserInDepartment in Elasticsearch
        verify(mockUserInDepartmentSearchRepository, times(0)).save(userInDepartment);
    }

    @Test
    @Transactional
    public void deleteUserInDepartment() throws Exception {
        // Initialize the database
        userInDepartmentRepository.saveAndFlush(userInDepartment);

        int databaseSizeBeforeDelete = userInDepartmentRepository.findAll().size();

        // Delete the userInDepartment
        restUserInDepartmentMockMvc.perform(delete("/api/user-in-departments/{id}", userInDepartment.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserInDepartment> userInDepartmentList = userInDepartmentRepository.findAll();
        assertThat(userInDepartmentList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the UserInDepartment in Elasticsearch
        verify(mockUserInDepartmentSearchRepository, times(1)).deleteById(userInDepartment.getId());
    }

    @Test
    @Transactional
    public void searchUserInDepartment() throws Exception {
        // Initialize the database
        userInDepartmentRepository.saveAndFlush(userInDepartment);
        when(mockUserInDepartmentSearchRepository.search(queryStringQuery("id:" + userInDepartment.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(userInDepartment), PageRequest.of(0, 1), 1));
        // Search the userInDepartment
        restUserInDepartmentMockMvc.perform(get("/api/_search/user-in-departments?query=id:" + userInDepartment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userInDepartment.getId().intValue())));
    }
}
