package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.Departament;
import com.jacintoconvit.intranet.repository.DepartamentRepository;
import com.jacintoconvit.intranet.repository.search.DepartamentSearchRepository;
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
 * Integration tests for the {@link DepartamentResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class DepartamentResourceIT {

    private static final String DEFAULT_NAME_DEPARTAMENT = "AAAAAAAAAA";
    private static final String UPDATED_NAME_DEPARTAMENT = "BBBBBBBBBB";

    private static final Integer DEFAULT_ID_DEPARTAMENT = 1;
    private static final Integer UPDATED_ID_DEPARTAMENT = 2;

    private static final String DEFAULT_SHORT_DSC = "AAAAAAAAAA";
    private static final String UPDATED_SHORT_DSC = "BBBBBBBBBB";

    @Autowired
    private DepartamentRepository departamentRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.DepartamentSearchRepositoryMockConfiguration
     */
    @Autowired
    private DepartamentSearchRepository mockDepartamentSearchRepository;

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

    private MockMvc restDepartamentMockMvc;

    private Departament departament;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DepartamentResource departamentResource = new DepartamentResource(departamentRepository, mockDepartamentSearchRepository);
        this.restDepartamentMockMvc = MockMvcBuilders.standaloneSetup(departamentResource)
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
    public static Departament createEntity(EntityManager em) {
        Departament departament = new Departament()
            .nameDepartament(DEFAULT_NAME_DEPARTAMENT)
            .idDepartament(DEFAULT_ID_DEPARTAMENT)
            .shortDsc(DEFAULT_SHORT_DSC);
        return departament;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Departament createUpdatedEntity(EntityManager em) {
        Departament departament = new Departament()
            .nameDepartament(UPDATED_NAME_DEPARTAMENT)
            .idDepartament(UPDATED_ID_DEPARTAMENT)
            .shortDsc(UPDATED_SHORT_DSC);
        return departament;
    }

    @BeforeEach
    public void initTest() {
        departament = createEntity(em);
    }

    @Test
    @Transactional
    public void createDepartament() throws Exception {
        int databaseSizeBeforeCreate = departamentRepository.findAll().size();

        // Create the Departament
        restDepartamentMockMvc.perform(post("/api/departaments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(departament)))
            .andExpect(status().isCreated());

        // Validate the Departament in the database
        List<Departament> departamentList = departamentRepository.findAll();
        assertThat(departamentList).hasSize(databaseSizeBeforeCreate + 1);
        Departament testDepartament = departamentList.get(departamentList.size() - 1);
        assertThat(testDepartament.getNameDepartament()).isEqualTo(DEFAULT_NAME_DEPARTAMENT);
        assertThat(testDepartament.getIdDepartament()).isEqualTo(DEFAULT_ID_DEPARTAMENT);
        assertThat(testDepartament.getShortDsc()).isEqualTo(DEFAULT_SHORT_DSC);

        // Validate the Departament in Elasticsearch
        verify(mockDepartamentSearchRepository, times(1)).save(testDepartament);
    }

    @Test
    @Transactional
    public void createDepartamentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = departamentRepository.findAll().size();

        // Create the Departament with an existing ID
        departament.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDepartamentMockMvc.perform(post("/api/departaments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(departament)))
            .andExpect(status().isBadRequest());

        // Validate the Departament in the database
        List<Departament> departamentList = departamentRepository.findAll();
        assertThat(departamentList).hasSize(databaseSizeBeforeCreate);

        // Validate the Departament in Elasticsearch
        verify(mockDepartamentSearchRepository, times(0)).save(departament);
    }


    @Test
    @Transactional
    public void getAllDepartaments() throws Exception {
        // Initialize the database
        departamentRepository.saveAndFlush(departament);

        // Get all the departamentList
        restDepartamentMockMvc.perform(get("/api/departaments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(departament.getId().intValue())))
            .andExpect(jsonPath("$.[*].nameDepartament").value(hasItem(DEFAULT_NAME_DEPARTAMENT)))
            .andExpect(jsonPath("$.[*].idDepartament").value(hasItem(DEFAULT_ID_DEPARTAMENT)))
            .andExpect(jsonPath("$.[*].shortDsc").value(hasItem(DEFAULT_SHORT_DSC)));
    }
    
    @Test
    @Transactional
    public void getDepartament() throws Exception {
        // Initialize the database
        departamentRepository.saveAndFlush(departament);

        // Get the departament
        restDepartamentMockMvc.perform(get("/api/departaments/{id}", departament.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(departament.getId().intValue()))
            .andExpect(jsonPath("$.nameDepartament").value(DEFAULT_NAME_DEPARTAMENT))
            .andExpect(jsonPath("$.idDepartament").value(DEFAULT_ID_DEPARTAMENT))
            .andExpect(jsonPath("$.shortDsc").value(DEFAULT_SHORT_DSC));
    }

    @Test
    @Transactional
    public void getNonExistingDepartament() throws Exception {
        // Get the departament
        restDepartamentMockMvc.perform(get("/api/departaments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDepartament() throws Exception {
        // Initialize the database
        departamentRepository.saveAndFlush(departament);

        int databaseSizeBeforeUpdate = departamentRepository.findAll().size();

        // Update the departament
        Departament updatedDepartament = departamentRepository.findById(departament.getId()).get();
        // Disconnect from session so that the updates on updatedDepartament are not directly saved in db
        em.detach(updatedDepartament);
        updatedDepartament
            .nameDepartament(UPDATED_NAME_DEPARTAMENT)
            .idDepartament(UPDATED_ID_DEPARTAMENT)
            .shortDsc(UPDATED_SHORT_DSC);

        restDepartamentMockMvc.perform(put("/api/departaments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDepartament)))
            .andExpect(status().isOk());

        // Validate the Departament in the database
        List<Departament> departamentList = departamentRepository.findAll();
        assertThat(departamentList).hasSize(databaseSizeBeforeUpdate);
        Departament testDepartament = departamentList.get(departamentList.size() - 1);
        assertThat(testDepartament.getNameDepartament()).isEqualTo(UPDATED_NAME_DEPARTAMENT);
        assertThat(testDepartament.getIdDepartament()).isEqualTo(UPDATED_ID_DEPARTAMENT);
        assertThat(testDepartament.getShortDsc()).isEqualTo(UPDATED_SHORT_DSC);

        // Validate the Departament in Elasticsearch
        verify(mockDepartamentSearchRepository, times(1)).save(testDepartament);
    }

    @Test
    @Transactional
    public void updateNonExistingDepartament() throws Exception {
        int databaseSizeBeforeUpdate = departamentRepository.findAll().size();

        // Create the Departament

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDepartamentMockMvc.perform(put("/api/departaments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(departament)))
            .andExpect(status().isBadRequest());

        // Validate the Departament in the database
        List<Departament> departamentList = departamentRepository.findAll();
        assertThat(departamentList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Departament in Elasticsearch
        verify(mockDepartamentSearchRepository, times(0)).save(departament);
    }

    @Test
    @Transactional
    public void deleteDepartament() throws Exception {
        // Initialize the database
        departamentRepository.saveAndFlush(departament);

        int databaseSizeBeforeDelete = departamentRepository.findAll().size();

        // Delete the departament
        restDepartamentMockMvc.perform(delete("/api/departaments/{id}", departament.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Departament> departamentList = departamentRepository.findAll();
        assertThat(departamentList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Departament in Elasticsearch
        verify(mockDepartamentSearchRepository, times(1)).deleteById(departament.getId());
    }

    @Test
    @Transactional
    public void searchDepartament() throws Exception {
        // Initialize the database
        departamentRepository.saveAndFlush(departament);
        when(mockDepartamentSearchRepository.search(queryStringQuery("id:" + departament.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(departament), PageRequest.of(0, 1), 1));
        // Search the departament
        restDepartamentMockMvc.perform(get("/api/_search/departaments?query=id:" + departament.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(departament.getId().intValue())))
            .andExpect(jsonPath("$.[*].nameDepartament").value(hasItem(DEFAULT_NAME_DEPARTAMENT)))
            .andExpect(jsonPath("$.[*].idDepartament").value(hasItem(DEFAULT_ID_DEPARTAMENT)))
            .andExpect(jsonPath("$.[*].shortDsc").value(hasItem(DEFAULT_SHORT_DSC)));
    }
}
