package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.Closures;
import com.jacintoconvit.intranet.domain.Finding;
import com.jacintoconvit.intranet.repository.ClosuresRepository;
import com.jacintoconvit.intranet.repository.search.ClosuresSearchRepository;
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
 * Integration tests for the {@link ClosuresResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class ClosuresResourceIT {

    private static final String DEFAULT_STATE_CLOSURE = "AAAAAAAAAA";
    private static final String UPDATED_STATE_CLOSURE = "BBBBBBBBBB";

    private static final String DEFAULT_ACTION_CLOSED = "AAAAAAAAAA";
    private static final String UPDATED_ACTION_CLOSED = "BBBBBBBBBB";

    private static final Double DEFAULT_EFFECTIVENESS = 1D;
    private static final Double UPDATED_EFFECTIVENESS = 2D;

    private static final String DEFAULT_DEPT = "AAAAAAAAAA";
    private static final String UPDATED_DEPT = "BBBBBBBBBB";

    private static final String DEFAULT_IMPROVE_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_IMPROVE_COMMENT = "BBBBBBBBBB";

    private static final String DEFAULT_EFFECTIVENESS_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_EFFECTIVENESS_COMMENT = "BBBBBBBBBB";

    @Autowired
    private ClosuresRepository closuresRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.ClosuresSearchRepositoryMockConfiguration
     */
    @Autowired
    private ClosuresSearchRepository mockClosuresSearchRepository;

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

    private MockMvc restClosuresMockMvc;

    private Closures closures;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ClosuresResource closuresResource = new ClosuresResource(closuresRepository, mockClosuresSearchRepository);
        this.restClosuresMockMvc = MockMvcBuilders.standaloneSetup(closuresResource)
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
    public static Closures createEntity(EntityManager em) {
        Closures closures = new Closures()
            .stateClosure(DEFAULT_STATE_CLOSURE)
            .actionClosed(DEFAULT_ACTION_CLOSED)
            .effectiveness(DEFAULT_EFFECTIVENESS)
            .dept(DEFAULT_DEPT)
            .improveComment(DEFAULT_IMPROVE_COMMENT)
            .effectivenessComment(DEFAULT_EFFECTIVENESS_COMMENT);
        // Add required entity
        Finding finding;
        if (TestUtil.findAll(em, Finding.class).isEmpty()) {
            finding = FindingResourceIT.createEntity(em);
            em.persist(finding);
            em.flush();
        } else {
            finding = TestUtil.findAll(em, Finding.class).get(0);
        }
        closures.setFindClose(finding);
        return closures;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Closures createUpdatedEntity(EntityManager em) {
        Closures closures = new Closures()
            .stateClosure(UPDATED_STATE_CLOSURE)
            .actionClosed(UPDATED_ACTION_CLOSED)
            .effectiveness(UPDATED_EFFECTIVENESS)
            .dept(UPDATED_DEPT)
            .improveComment(UPDATED_IMPROVE_COMMENT)
            .effectivenessComment(UPDATED_EFFECTIVENESS_COMMENT);
        // Add required entity
        Finding finding;
        if (TestUtil.findAll(em, Finding.class).isEmpty()) {
            finding = FindingResourceIT.createUpdatedEntity(em);
            em.persist(finding);
            em.flush();
        } else {
            finding = TestUtil.findAll(em, Finding.class).get(0);
        }
        closures.setFindClose(finding);
        return closures;
    }

    @BeforeEach
    public void initTest() {
        closures = createEntity(em);
    }

    @Test
    @Transactional
    public void createClosures() throws Exception {
        int databaseSizeBeforeCreate = closuresRepository.findAll().size();

        // Create the Closures
        restClosuresMockMvc.perform(post("/api/closures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(closures)))
            .andExpect(status().isCreated());

        // Validate the Closures in the database
        List<Closures> closuresList = closuresRepository.findAll();
        assertThat(closuresList).hasSize(databaseSizeBeforeCreate + 1);
        Closures testClosures = closuresList.get(closuresList.size() - 1);
        assertThat(testClosures.getStateClosure()).isEqualTo(DEFAULT_STATE_CLOSURE);
        assertThat(testClosures.getActionClosed()).isEqualTo(DEFAULT_ACTION_CLOSED);
        assertThat(testClosures.getEffectiveness()).isEqualTo(DEFAULT_EFFECTIVENESS);
        assertThat(testClosures.getDept()).isEqualTo(DEFAULT_DEPT);
        assertThat(testClosures.getImproveComment()).isEqualTo(DEFAULT_IMPROVE_COMMENT);
        assertThat(testClosures.getEffectivenessComment()).isEqualTo(DEFAULT_EFFECTIVENESS_COMMENT);

        // Validate the Closures in Elasticsearch
        verify(mockClosuresSearchRepository, times(1)).save(testClosures);
    }

    @Test
    @Transactional
    public void createClosuresWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = closuresRepository.findAll().size();

        // Create the Closures with an existing ID
        closures.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restClosuresMockMvc.perform(post("/api/closures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(closures)))
            .andExpect(status().isBadRequest());

        // Validate the Closures in the database
        List<Closures> closuresList = closuresRepository.findAll();
        assertThat(closuresList).hasSize(databaseSizeBeforeCreate);

        // Validate the Closures in Elasticsearch
        verify(mockClosuresSearchRepository, times(0)).save(closures);
    }


    @Test
    @Transactional
    public void getAllClosures() throws Exception {
        // Initialize the database
        closuresRepository.saveAndFlush(closures);

        // Get all the closuresList
        restClosuresMockMvc.perform(get("/api/closures?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(closures.getId().intValue())))
            .andExpect(jsonPath("$.[*].stateClosure").value(hasItem(DEFAULT_STATE_CLOSURE)))
            .andExpect(jsonPath("$.[*].actionClosed").value(hasItem(DEFAULT_ACTION_CLOSED)))
            .andExpect(jsonPath("$.[*].effectiveness").value(hasItem(DEFAULT_EFFECTIVENESS.doubleValue())))
            .andExpect(jsonPath("$.[*].dept").value(hasItem(DEFAULT_DEPT)))
            .andExpect(jsonPath("$.[*].improveComment").value(hasItem(DEFAULT_IMPROVE_COMMENT)))
            .andExpect(jsonPath("$.[*].effectivenessComment").value(hasItem(DEFAULT_EFFECTIVENESS_COMMENT)));
    }
    
    @Test
    @Transactional
    public void getClosures() throws Exception {
        // Initialize the database
        closuresRepository.saveAndFlush(closures);

        // Get the closures
        restClosuresMockMvc.perform(get("/api/closures/{id}", closures.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(closures.getId().intValue()))
            .andExpect(jsonPath("$.stateClosure").value(DEFAULT_STATE_CLOSURE))
            .andExpect(jsonPath("$.actionClosed").value(DEFAULT_ACTION_CLOSED))
            .andExpect(jsonPath("$.effectiveness").value(DEFAULT_EFFECTIVENESS.doubleValue()))
            .andExpect(jsonPath("$.dept").value(DEFAULT_DEPT))
            .andExpect(jsonPath("$.improveComment").value(DEFAULT_IMPROVE_COMMENT))
            .andExpect(jsonPath("$.effectivenessComment").value(DEFAULT_EFFECTIVENESS_COMMENT));
    }

    @Test
    @Transactional
    public void getNonExistingClosures() throws Exception {
        // Get the closures
        restClosuresMockMvc.perform(get("/api/closures/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateClosures() throws Exception {
        // Initialize the database
        closuresRepository.saveAndFlush(closures);

        int databaseSizeBeforeUpdate = closuresRepository.findAll().size();

        // Update the closures
        Closures updatedClosures = closuresRepository.findById(closures.getId()).get();
        // Disconnect from session so that the updates on updatedClosures are not directly saved in db
        em.detach(updatedClosures);
        updatedClosures
            .stateClosure(UPDATED_STATE_CLOSURE)
            .actionClosed(UPDATED_ACTION_CLOSED)
            .effectiveness(UPDATED_EFFECTIVENESS)
            .dept(UPDATED_DEPT)
            .improveComment(UPDATED_IMPROVE_COMMENT)
            .effectivenessComment(UPDATED_EFFECTIVENESS_COMMENT);

        restClosuresMockMvc.perform(put("/api/closures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedClosures)))
            .andExpect(status().isOk());

        // Validate the Closures in the database
        List<Closures> closuresList = closuresRepository.findAll();
        assertThat(closuresList).hasSize(databaseSizeBeforeUpdate);
        Closures testClosures = closuresList.get(closuresList.size() - 1);
        assertThat(testClosures.getStateClosure()).isEqualTo(UPDATED_STATE_CLOSURE);
        assertThat(testClosures.getActionClosed()).isEqualTo(UPDATED_ACTION_CLOSED);
        assertThat(testClosures.getEffectiveness()).isEqualTo(UPDATED_EFFECTIVENESS);
        assertThat(testClosures.getDept()).isEqualTo(UPDATED_DEPT);
        assertThat(testClosures.getImproveComment()).isEqualTo(UPDATED_IMPROVE_COMMENT);
        assertThat(testClosures.getEffectivenessComment()).isEqualTo(UPDATED_EFFECTIVENESS_COMMENT);

        // Validate the Closures in Elasticsearch
        verify(mockClosuresSearchRepository, times(1)).save(testClosures);
    }

    @Test
    @Transactional
    public void updateNonExistingClosures() throws Exception {
        int databaseSizeBeforeUpdate = closuresRepository.findAll().size();

        // Create the Closures

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClosuresMockMvc.perform(put("/api/closures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(closures)))
            .andExpect(status().isBadRequest());

        // Validate the Closures in the database
        List<Closures> closuresList = closuresRepository.findAll();
        assertThat(closuresList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Closures in Elasticsearch
        verify(mockClosuresSearchRepository, times(0)).save(closures);
    }

    @Test
    @Transactional
    public void deleteClosures() throws Exception {
        // Initialize the database
        closuresRepository.saveAndFlush(closures);

        int databaseSizeBeforeDelete = closuresRepository.findAll().size();

        // Delete the closures
        restClosuresMockMvc.perform(delete("/api/closures/{id}", closures.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Closures> closuresList = closuresRepository.findAll();
        assertThat(closuresList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Closures in Elasticsearch
        verify(mockClosuresSearchRepository, times(1)).deleteById(closures.getId());
    }

    @Test
    @Transactional
    public void searchClosures() throws Exception {
        // Initialize the database
        closuresRepository.saveAndFlush(closures);
        when(mockClosuresSearchRepository.search(queryStringQuery("id:" + closures.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(closures), PageRequest.of(0, 1), 1));
        // Search the closures
        restClosuresMockMvc.perform(get("/api/_search/closures?query=id:" + closures.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(closures.getId().intValue())))
            .andExpect(jsonPath("$.[*].stateClosure").value(hasItem(DEFAULT_STATE_CLOSURE)))
            .andExpect(jsonPath("$.[*].actionClosed").value(hasItem(DEFAULT_ACTION_CLOSED)))
            .andExpect(jsonPath("$.[*].effectiveness").value(hasItem(DEFAULT_EFFECTIVENESS.doubleValue())))
            .andExpect(jsonPath("$.[*].dept").value(hasItem(DEFAULT_DEPT)))
            .andExpect(jsonPath("$.[*].improveComment").value(hasItem(DEFAULT_IMPROVE_COMMENT)))
            .andExpect(jsonPath("$.[*].effectivenessComment").value(hasItem(DEFAULT_EFFECTIVENESS_COMMENT)));
    }
}
