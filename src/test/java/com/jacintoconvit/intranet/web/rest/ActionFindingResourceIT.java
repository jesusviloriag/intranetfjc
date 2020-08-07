package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.ActionFinding;
import com.jacintoconvit.intranet.domain.Finding;
import com.jacintoconvit.intranet.repository.ActionFindingRepository;
import com.jacintoconvit.intranet.repository.search.ActionFindingSearchRepository;
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
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link ActionFindingResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class ActionFindingResourceIT {

    private static final String DEFAULT_DESC_ACTION = "AAAAAAAAAA";
    private static final String UPDATED_DESC_ACTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_START_ACTION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_START_ACTION = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_COMMIT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_COMMIT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_REAL_COMMIT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_REAL_COMMIT = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESC_HOW = "AAAAAAAAAA";
    private static final String UPDATED_DESC_HOW = "BBBBBBBBBB";

    private static final String DEFAULT_INVOLVED = "AAAAAAAAAA";
    private static final String UPDATED_INVOLVED = "BBBBBBBBBB";

    private static final Integer DEFAULT_STATUS = 1;
    private static final Integer UPDATED_STATUS = 2;

    private static final byte[] DEFAULT_EVIDENCE_DOC = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_EVIDENCE_DOC = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_EVIDENCE_DOC_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_EVIDENCE_DOC_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_OBSERVATION = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVATION = "BBBBBBBBBB";

    @Autowired
    private ActionFindingRepository actionFindingRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.ActionFindingSearchRepositoryMockConfiguration
     */
    @Autowired
    private ActionFindingSearchRepository mockActionFindingSearchRepository;

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

    private MockMvc restActionFindingMockMvc;

    private ActionFinding actionFinding;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ActionFindingResource actionFindingResource = new ActionFindingResource(actionFindingRepository, mockActionFindingSearchRepository);
        this.restActionFindingMockMvc = MockMvcBuilders.standaloneSetup(actionFindingResource)
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
    public static ActionFinding createEntity(EntityManager em) {
        ActionFinding actionFinding = new ActionFinding()
            .descAction(DEFAULT_DESC_ACTION)
            .dateStartAction(DEFAULT_DATE_START_ACTION)
            .dateCommit(DEFAULT_DATE_COMMIT)
            .dateRealCommit(DEFAULT_DATE_REAL_COMMIT)
            .descHow(DEFAULT_DESC_HOW)
            .involved(DEFAULT_INVOLVED)
            .status(DEFAULT_STATUS)
            .evidenceDoc(DEFAULT_EVIDENCE_DOC)
            .evidenceDocContentType(DEFAULT_EVIDENCE_DOC_CONTENT_TYPE)
            .observation(DEFAULT_OBSERVATION);
        // Add required entity
        Finding finding;
        if (TestUtil.findAll(em, Finding.class).isEmpty()) {
            finding = FindingResourceIT.createEntity(em);
            em.persist(finding);
            em.flush();
        } else {
            finding = TestUtil.findAll(em, Finding.class).get(0);
        }
        actionFinding.setActFinding(finding);
        return actionFinding;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionFinding createUpdatedEntity(EntityManager em) {
        ActionFinding actionFinding = new ActionFinding()
            .descAction(UPDATED_DESC_ACTION)
            .dateStartAction(UPDATED_DATE_START_ACTION)
            .dateCommit(UPDATED_DATE_COMMIT)
            .dateRealCommit(UPDATED_DATE_REAL_COMMIT)
            .descHow(UPDATED_DESC_HOW)
            .involved(UPDATED_INVOLVED)
            .status(UPDATED_STATUS)
            .evidenceDoc(UPDATED_EVIDENCE_DOC)
            .evidenceDocContentType(UPDATED_EVIDENCE_DOC_CONTENT_TYPE)
            .observation(UPDATED_OBSERVATION);
        // Add required entity
        Finding finding;
        if (TestUtil.findAll(em, Finding.class).isEmpty()) {
            finding = FindingResourceIT.createUpdatedEntity(em);
            em.persist(finding);
            em.flush();
        } else {
            finding = TestUtil.findAll(em, Finding.class).get(0);
        }
        actionFinding.setActFinding(finding);
        return actionFinding;
    }

    @BeforeEach
    public void initTest() {
        actionFinding = createEntity(em);
    }

    @Test
    @Transactional
    public void createActionFinding() throws Exception {
        int databaseSizeBeforeCreate = actionFindingRepository.findAll().size();

        // Create the ActionFinding
        restActionFindingMockMvc.perform(post("/api/action-findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(actionFinding)))
            .andExpect(status().isCreated());

        // Validate the ActionFinding in the database
        List<ActionFinding> actionFindingList = actionFindingRepository.findAll();
        assertThat(actionFindingList).hasSize(databaseSizeBeforeCreate + 1);
        ActionFinding testActionFinding = actionFindingList.get(actionFindingList.size() - 1);
        assertThat(testActionFinding.getDescAction()).isEqualTo(DEFAULT_DESC_ACTION);
        assertThat(testActionFinding.getDateStartAction()).isEqualTo(DEFAULT_DATE_START_ACTION);
        assertThat(testActionFinding.getDateCommit()).isEqualTo(DEFAULT_DATE_COMMIT);
        assertThat(testActionFinding.getDateRealCommit()).isEqualTo(DEFAULT_DATE_REAL_COMMIT);
        assertThat(testActionFinding.getDescHow()).isEqualTo(DEFAULT_DESC_HOW);
        assertThat(testActionFinding.getInvolved()).isEqualTo(DEFAULT_INVOLVED);
        assertThat(testActionFinding.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testActionFinding.getEvidenceDoc()).isEqualTo(DEFAULT_EVIDENCE_DOC);
        assertThat(testActionFinding.getEvidenceDocContentType()).isEqualTo(DEFAULT_EVIDENCE_DOC_CONTENT_TYPE);
        assertThat(testActionFinding.getObservation()).isEqualTo(DEFAULT_OBSERVATION);

        // Validate the ActionFinding in Elasticsearch
        verify(mockActionFindingSearchRepository, times(1)).save(testActionFinding);
    }

    @Test
    @Transactional
    public void createActionFindingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = actionFindingRepository.findAll().size();

        // Create the ActionFinding with an existing ID
        actionFinding.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restActionFindingMockMvc.perform(post("/api/action-findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(actionFinding)))
            .andExpect(status().isBadRequest());

        // Validate the ActionFinding in the database
        List<ActionFinding> actionFindingList = actionFindingRepository.findAll();
        assertThat(actionFindingList).hasSize(databaseSizeBeforeCreate);

        // Validate the ActionFinding in Elasticsearch
        verify(mockActionFindingSearchRepository, times(0)).save(actionFinding);
    }


    @Test
    @Transactional
    public void getAllActionFindings() throws Exception {
        // Initialize the database
        actionFindingRepository.saveAndFlush(actionFinding);

        // Get all the actionFindingList
        restActionFindingMockMvc.perform(get("/api/action-findings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actionFinding.getId().intValue())))
            .andExpect(jsonPath("$.[*].descAction").value(hasItem(DEFAULT_DESC_ACTION)))
            .andExpect(jsonPath("$.[*].dateStartAction").value(hasItem(DEFAULT_DATE_START_ACTION.toString())))
            .andExpect(jsonPath("$.[*].dateCommit").value(hasItem(DEFAULT_DATE_COMMIT.toString())))
            .andExpect(jsonPath("$.[*].dateRealCommit").value(hasItem(DEFAULT_DATE_REAL_COMMIT.toString())))
            .andExpect(jsonPath("$.[*].descHow").value(hasItem(DEFAULT_DESC_HOW)))
            .andExpect(jsonPath("$.[*].involved").value(hasItem(DEFAULT_INVOLVED)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].evidenceDocContentType").value(hasItem(DEFAULT_EVIDENCE_DOC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].evidenceDoc").value(hasItem(Base64Utils.encodeToString(DEFAULT_EVIDENCE_DOC))))
            .andExpect(jsonPath("$.[*].observation").value(hasItem(DEFAULT_OBSERVATION)));
    }
    
    @Test
    @Transactional
    public void getActionFinding() throws Exception {
        // Initialize the database
        actionFindingRepository.saveAndFlush(actionFinding);

        // Get the actionFinding
        restActionFindingMockMvc.perform(get("/api/action-findings/{id}", actionFinding.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(actionFinding.getId().intValue()))
            .andExpect(jsonPath("$.descAction").value(DEFAULT_DESC_ACTION))
            .andExpect(jsonPath("$.dateStartAction").value(DEFAULT_DATE_START_ACTION.toString()))
            .andExpect(jsonPath("$.dateCommit").value(DEFAULT_DATE_COMMIT.toString()))
            .andExpect(jsonPath("$.dateRealCommit").value(DEFAULT_DATE_REAL_COMMIT.toString()))
            .andExpect(jsonPath("$.descHow").value(DEFAULT_DESC_HOW))
            .andExpect(jsonPath("$.involved").value(DEFAULT_INVOLVED))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.evidenceDocContentType").value(DEFAULT_EVIDENCE_DOC_CONTENT_TYPE))
            .andExpect(jsonPath("$.evidenceDoc").value(Base64Utils.encodeToString(DEFAULT_EVIDENCE_DOC)))
            .andExpect(jsonPath("$.observation").value(DEFAULT_OBSERVATION));
    }

    @Test
    @Transactional
    public void getNonExistingActionFinding() throws Exception {
        // Get the actionFinding
        restActionFindingMockMvc.perform(get("/api/action-findings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateActionFinding() throws Exception {
        // Initialize the database
        actionFindingRepository.saveAndFlush(actionFinding);

        int databaseSizeBeforeUpdate = actionFindingRepository.findAll().size();

        // Update the actionFinding
        ActionFinding updatedActionFinding = actionFindingRepository.findById(actionFinding.getId()).get();
        // Disconnect from session so that the updates on updatedActionFinding are not directly saved in db
        em.detach(updatedActionFinding);
        updatedActionFinding
            .descAction(UPDATED_DESC_ACTION)
            .dateStartAction(UPDATED_DATE_START_ACTION)
            .dateCommit(UPDATED_DATE_COMMIT)
            .dateRealCommit(UPDATED_DATE_REAL_COMMIT)
            .descHow(UPDATED_DESC_HOW)
            .involved(UPDATED_INVOLVED)
            .status(UPDATED_STATUS)
            .evidenceDoc(UPDATED_EVIDENCE_DOC)
            .evidenceDocContentType(UPDATED_EVIDENCE_DOC_CONTENT_TYPE)
            .observation(UPDATED_OBSERVATION);

        restActionFindingMockMvc.perform(put("/api/action-findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedActionFinding)))
            .andExpect(status().isOk());

        // Validate the ActionFinding in the database
        List<ActionFinding> actionFindingList = actionFindingRepository.findAll();
        assertThat(actionFindingList).hasSize(databaseSizeBeforeUpdate);
        ActionFinding testActionFinding = actionFindingList.get(actionFindingList.size() - 1);
        assertThat(testActionFinding.getDescAction()).isEqualTo(UPDATED_DESC_ACTION);
        assertThat(testActionFinding.getDateStartAction()).isEqualTo(UPDATED_DATE_START_ACTION);
        assertThat(testActionFinding.getDateCommit()).isEqualTo(UPDATED_DATE_COMMIT);
        assertThat(testActionFinding.getDateRealCommit()).isEqualTo(UPDATED_DATE_REAL_COMMIT);
        assertThat(testActionFinding.getDescHow()).isEqualTo(UPDATED_DESC_HOW);
        assertThat(testActionFinding.getInvolved()).isEqualTo(UPDATED_INVOLVED);
        assertThat(testActionFinding.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testActionFinding.getEvidenceDoc()).isEqualTo(UPDATED_EVIDENCE_DOC);
        assertThat(testActionFinding.getEvidenceDocContentType()).isEqualTo(UPDATED_EVIDENCE_DOC_CONTENT_TYPE);
        assertThat(testActionFinding.getObservation()).isEqualTo(UPDATED_OBSERVATION);

        // Validate the ActionFinding in Elasticsearch
        verify(mockActionFindingSearchRepository, times(1)).save(testActionFinding);
    }

    @Test
    @Transactional
    public void updateNonExistingActionFinding() throws Exception {
        int databaseSizeBeforeUpdate = actionFindingRepository.findAll().size();

        // Create the ActionFinding

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionFindingMockMvc.perform(put("/api/action-findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(actionFinding)))
            .andExpect(status().isBadRequest());

        // Validate the ActionFinding in the database
        List<ActionFinding> actionFindingList = actionFindingRepository.findAll();
        assertThat(actionFindingList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ActionFinding in Elasticsearch
        verify(mockActionFindingSearchRepository, times(0)).save(actionFinding);
    }

    @Test
    @Transactional
    public void deleteActionFinding() throws Exception {
        // Initialize the database
        actionFindingRepository.saveAndFlush(actionFinding);

        int databaseSizeBeforeDelete = actionFindingRepository.findAll().size();

        // Delete the actionFinding
        restActionFindingMockMvc.perform(delete("/api/action-findings/{id}", actionFinding.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActionFinding> actionFindingList = actionFindingRepository.findAll();
        assertThat(actionFindingList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ActionFinding in Elasticsearch
        verify(mockActionFindingSearchRepository, times(1)).deleteById(actionFinding.getId());
    }

    @Test
    @Transactional
    public void searchActionFinding() throws Exception {
        // Initialize the database
        actionFindingRepository.saveAndFlush(actionFinding);
        when(mockActionFindingSearchRepository.search(queryStringQuery("id:" + actionFinding.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(actionFinding), PageRequest.of(0, 1), 1));
        // Search the actionFinding
        restActionFindingMockMvc.perform(get("/api/_search/action-findings?query=id:" + actionFinding.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actionFinding.getId().intValue())))
            .andExpect(jsonPath("$.[*].descAction").value(hasItem(DEFAULT_DESC_ACTION)))
            .andExpect(jsonPath("$.[*].dateStartAction").value(hasItem(DEFAULT_DATE_START_ACTION.toString())))
            .andExpect(jsonPath("$.[*].dateCommit").value(hasItem(DEFAULT_DATE_COMMIT.toString())))
            .andExpect(jsonPath("$.[*].dateRealCommit").value(hasItem(DEFAULT_DATE_REAL_COMMIT.toString())))
            .andExpect(jsonPath("$.[*].descHow").value(hasItem(DEFAULT_DESC_HOW)))
            .andExpect(jsonPath("$.[*].involved").value(hasItem(DEFAULT_INVOLVED)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].evidenceDocContentType").value(hasItem(DEFAULT_EVIDENCE_DOC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].evidenceDoc").value(hasItem(Base64Utils.encodeToString(DEFAULT_EVIDENCE_DOC))))
            .andExpect(jsonPath("$.[*].observation").value(hasItem(DEFAULT_OBSERVATION)));
    }
}
