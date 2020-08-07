package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.Finding;
import com.jacintoconvit.intranet.domain.User;
import com.jacintoconvit.intranet.repository.FindingRepository;
import com.jacintoconvit.intranet.repository.search.FindingSearchRepository;
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
 * Integration tests for the {@link FindingResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class FindingResourceIT {

    private static final String DEFAULT_COD_FINDING = "AAAAAAAAAA";
    private static final String UPDATED_COD_FINDING = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_END = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_CLOSURE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CLOSURE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_EVIDENCE = "AAAAAAAAAA";
    private static final String UPDATED_EVIDENCE = "BBBBBBBBBB";

    private static final String DEFAULT_METHODOLOGY = "AAAAAAAAAA";
    private static final String UPDATED_METHODOLOGY = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LINK_DOC = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LINK_DOC = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LINK_DOC_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LINK_DOC_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_DESC_HOW = "AAAAAAAAAA";
    private static final String UPDATED_DESC_HOW = "BBBBBBBBBB";

    private static final Integer DEFAULT_TYPE_FINDING = 1;
    private static final Integer UPDATED_TYPE_FINDING = 2;

    private static final Integer DEFAULT_DEPT_INVOL = 1;
    private static final Integer UPDATED_DEPT_INVOL = 2;

    private static final String DEFAULT_IDENTIFICATION_CAUSE = "AAAAAAAAAA";
    private static final String UPDATED_IDENTIFICATION_CAUSE = "BBBBBBBBBB";

    private static final String DEFAULT_CORRECTIVE_ACT = "AAAAAAAAAA";
    private static final String UPDATED_CORRECTIVE_ACT = "BBBBBBBBBB";

    private static final String DEFAULT_ACTION_DESC = "AAAAAAAAAA";
    private static final String UPDATED_ACTION_DESC = "BBBBBBBBBB";

    @Autowired
    private FindingRepository findingRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.FindingSearchRepositoryMockConfiguration
     */
    @Autowired
    private FindingSearchRepository mockFindingSearchRepository;

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

    private MockMvc restFindingMockMvc;

    private Finding finding;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FindingResource findingResource = new FindingResource(findingRepository, mockFindingSearchRepository);
        this.restFindingMockMvc = MockMvcBuilders.standaloneSetup(findingResource)
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
    public static Finding createEntity(EntityManager em) {
        Finding finding = new Finding()
            .codFinding(DEFAULT_COD_FINDING)
            .dateStart(DEFAULT_DATE_START)
            .dateEnd(DEFAULT_DATE_END)
            .dateClosure(DEFAULT_DATE_CLOSURE)
            .description(DEFAULT_DESCRIPTION)
            .evidence(DEFAULT_EVIDENCE)
            .methodology(DEFAULT_METHODOLOGY)
            .linkDoc(DEFAULT_LINK_DOC)
            .linkDocContentType(DEFAULT_LINK_DOC_CONTENT_TYPE)
            .descHow(DEFAULT_DESC_HOW)
            .typeFinding(DEFAULT_TYPE_FINDING)
            .deptInvol(DEFAULT_DEPT_INVOL)
            .identificationCause(DEFAULT_IDENTIFICATION_CAUSE)
            .correctiveAct(DEFAULT_CORRECTIVE_ACT)
            .actionDesc(DEFAULT_ACTION_DESC);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        finding.setCreator(user);
        return finding;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Finding createUpdatedEntity(EntityManager em) {
        Finding finding = new Finding()
            .codFinding(UPDATED_COD_FINDING)
            .dateStart(UPDATED_DATE_START)
            .dateEnd(UPDATED_DATE_END)
            .dateClosure(UPDATED_DATE_CLOSURE)
            .description(UPDATED_DESCRIPTION)
            .evidence(UPDATED_EVIDENCE)
            .methodology(UPDATED_METHODOLOGY)
            .linkDoc(UPDATED_LINK_DOC)
            .linkDocContentType(UPDATED_LINK_DOC_CONTENT_TYPE)
            .descHow(UPDATED_DESC_HOW)
            .typeFinding(UPDATED_TYPE_FINDING)
            .deptInvol(UPDATED_DEPT_INVOL)
            .identificationCause(UPDATED_IDENTIFICATION_CAUSE)
            .correctiveAct(UPDATED_CORRECTIVE_ACT)
            .actionDesc(UPDATED_ACTION_DESC);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        finding.setCreator(user);
        return finding;
    }

    @BeforeEach
    public void initTest() {
        finding = createEntity(em);
    }

    @Test
    @Transactional
    public void createFinding() throws Exception {
        int databaseSizeBeforeCreate = findingRepository.findAll().size();

        // Create the Finding
        restFindingMockMvc.perform(post("/api/findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(finding)))
            .andExpect(status().isCreated());

        // Validate the Finding in the database
        List<Finding> findingList = findingRepository.findAll();
        assertThat(findingList).hasSize(databaseSizeBeforeCreate + 1);
        Finding testFinding = findingList.get(findingList.size() - 1);
        assertThat(testFinding.getCodFinding()).isEqualTo(DEFAULT_COD_FINDING);
        assertThat(testFinding.getDateStart()).isEqualTo(DEFAULT_DATE_START);
        assertThat(testFinding.getDateEnd()).isEqualTo(DEFAULT_DATE_END);
        assertThat(testFinding.getDateClosure()).isEqualTo(DEFAULT_DATE_CLOSURE);
        assertThat(testFinding.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testFinding.getEvidence()).isEqualTo(DEFAULT_EVIDENCE);
        assertThat(testFinding.getMethodology()).isEqualTo(DEFAULT_METHODOLOGY);
        assertThat(testFinding.getLinkDoc()).isEqualTo(DEFAULT_LINK_DOC);
        assertThat(testFinding.getLinkDocContentType()).isEqualTo(DEFAULT_LINK_DOC_CONTENT_TYPE);
        assertThat(testFinding.getDescHow()).isEqualTo(DEFAULT_DESC_HOW);
        assertThat(testFinding.getTypeFinding()).isEqualTo(DEFAULT_TYPE_FINDING);
        assertThat(testFinding.getDeptInvol()).isEqualTo(DEFAULT_DEPT_INVOL);
        assertThat(testFinding.getIdentificationCause()).isEqualTo(DEFAULT_IDENTIFICATION_CAUSE);
        assertThat(testFinding.getCorrectiveAct()).isEqualTo(DEFAULT_CORRECTIVE_ACT);
        assertThat(testFinding.getActionDesc()).isEqualTo(DEFAULT_ACTION_DESC);

        // Validate the Finding in Elasticsearch
        verify(mockFindingSearchRepository, times(1)).save(testFinding);
    }

    @Test
    @Transactional
    public void createFindingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = findingRepository.findAll().size();

        // Create the Finding with an existing ID
        finding.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFindingMockMvc.perform(post("/api/findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(finding)))
            .andExpect(status().isBadRequest());

        // Validate the Finding in the database
        List<Finding> findingList = findingRepository.findAll();
        assertThat(findingList).hasSize(databaseSizeBeforeCreate);

        // Validate the Finding in Elasticsearch
        verify(mockFindingSearchRepository, times(0)).save(finding);
    }


    @Test
    @Transactional
    public void checkCodFindingIsRequired() throws Exception {
        int databaseSizeBeforeTest = findingRepository.findAll().size();
        // set the field null
        finding.setCodFinding(null);

        // Create the Finding, which fails.

        restFindingMockMvc.perform(post("/api/findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(finding)))
            .andExpect(status().isBadRequest());

        List<Finding> findingList = findingRepository.findAll();
        assertThat(findingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllFindings() throws Exception {
        // Initialize the database
        findingRepository.saveAndFlush(finding);

        // Get all the findingList
        restFindingMockMvc.perform(get("/api/findings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(finding.getId().intValue())))
            .andExpect(jsonPath("$.[*].codFinding").value(hasItem(DEFAULT_COD_FINDING)))
            .andExpect(jsonPath("$.[*].dateStart").value(hasItem(DEFAULT_DATE_START.toString())))
            .andExpect(jsonPath("$.[*].dateEnd").value(hasItem(DEFAULT_DATE_END.toString())))
            .andExpect(jsonPath("$.[*].dateClosure").value(hasItem(DEFAULT_DATE_CLOSURE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].evidence").value(hasItem(DEFAULT_EVIDENCE)))
            .andExpect(jsonPath("$.[*].methodology").value(hasItem(DEFAULT_METHODOLOGY)))
            .andExpect(jsonPath("$.[*].linkDocContentType").value(hasItem(DEFAULT_LINK_DOC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].linkDoc").value(hasItem(Base64Utils.encodeToString(DEFAULT_LINK_DOC))))
            .andExpect(jsonPath("$.[*].descHow").value(hasItem(DEFAULT_DESC_HOW)))
            .andExpect(jsonPath("$.[*].typeFinding").value(hasItem(DEFAULT_TYPE_FINDING)))
            .andExpect(jsonPath("$.[*].deptInvol").value(hasItem(DEFAULT_DEPT_INVOL)))
            .andExpect(jsonPath("$.[*].identificationCause").value(hasItem(DEFAULT_IDENTIFICATION_CAUSE)))
            .andExpect(jsonPath("$.[*].correctiveAct").value(hasItem(DEFAULT_CORRECTIVE_ACT)))
            .andExpect(jsonPath("$.[*].actionDesc").value(hasItem(DEFAULT_ACTION_DESC)));
    }
    
    @Test
    @Transactional
    public void getFinding() throws Exception {
        // Initialize the database
        findingRepository.saveAndFlush(finding);

        // Get the finding
        restFindingMockMvc.perform(get("/api/findings/{id}", finding.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(finding.getId().intValue()))
            .andExpect(jsonPath("$.codFinding").value(DEFAULT_COD_FINDING))
            .andExpect(jsonPath("$.dateStart").value(DEFAULT_DATE_START.toString()))
            .andExpect(jsonPath("$.dateEnd").value(DEFAULT_DATE_END.toString()))
            .andExpect(jsonPath("$.dateClosure").value(DEFAULT_DATE_CLOSURE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.evidence").value(DEFAULT_EVIDENCE))
            .andExpect(jsonPath("$.methodology").value(DEFAULT_METHODOLOGY))
            .andExpect(jsonPath("$.linkDocContentType").value(DEFAULT_LINK_DOC_CONTENT_TYPE))
            .andExpect(jsonPath("$.linkDoc").value(Base64Utils.encodeToString(DEFAULT_LINK_DOC)))
            .andExpect(jsonPath("$.descHow").value(DEFAULT_DESC_HOW))
            .andExpect(jsonPath("$.typeFinding").value(DEFAULT_TYPE_FINDING))
            .andExpect(jsonPath("$.deptInvol").value(DEFAULT_DEPT_INVOL))
            .andExpect(jsonPath("$.identificationCause").value(DEFAULT_IDENTIFICATION_CAUSE))
            .andExpect(jsonPath("$.correctiveAct").value(DEFAULT_CORRECTIVE_ACT))
            .andExpect(jsonPath("$.actionDesc").value(DEFAULT_ACTION_DESC));
    }

    @Test
    @Transactional
    public void getNonExistingFinding() throws Exception {
        // Get the finding
        restFindingMockMvc.perform(get("/api/findings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFinding() throws Exception {
        // Initialize the database
        findingRepository.saveAndFlush(finding);

        int databaseSizeBeforeUpdate = findingRepository.findAll().size();

        // Update the finding
        Finding updatedFinding = findingRepository.findById(finding.getId()).get();
        // Disconnect from session so that the updates on updatedFinding are not directly saved in db
        em.detach(updatedFinding);
        updatedFinding
            .codFinding(UPDATED_COD_FINDING)
            .dateStart(UPDATED_DATE_START)
            .dateEnd(UPDATED_DATE_END)
            .dateClosure(UPDATED_DATE_CLOSURE)
            .description(UPDATED_DESCRIPTION)
            .evidence(UPDATED_EVIDENCE)
            .methodology(UPDATED_METHODOLOGY)
            .linkDoc(UPDATED_LINK_DOC)
            .linkDocContentType(UPDATED_LINK_DOC_CONTENT_TYPE)
            .descHow(UPDATED_DESC_HOW)
            .typeFinding(UPDATED_TYPE_FINDING)
            .deptInvol(UPDATED_DEPT_INVOL)
            .identificationCause(UPDATED_IDENTIFICATION_CAUSE)
            .correctiveAct(UPDATED_CORRECTIVE_ACT)
            .actionDesc(UPDATED_ACTION_DESC);

        restFindingMockMvc.perform(put("/api/findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFinding)))
            .andExpect(status().isOk());

        // Validate the Finding in the database
        List<Finding> findingList = findingRepository.findAll();
        assertThat(findingList).hasSize(databaseSizeBeforeUpdate);
        Finding testFinding = findingList.get(findingList.size() - 1);
        assertThat(testFinding.getCodFinding()).isEqualTo(UPDATED_COD_FINDING);
        assertThat(testFinding.getDateStart()).isEqualTo(UPDATED_DATE_START);
        assertThat(testFinding.getDateEnd()).isEqualTo(UPDATED_DATE_END);
        assertThat(testFinding.getDateClosure()).isEqualTo(UPDATED_DATE_CLOSURE);
        assertThat(testFinding.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testFinding.getEvidence()).isEqualTo(UPDATED_EVIDENCE);
        assertThat(testFinding.getMethodology()).isEqualTo(UPDATED_METHODOLOGY);
        assertThat(testFinding.getLinkDoc()).isEqualTo(UPDATED_LINK_DOC);
        assertThat(testFinding.getLinkDocContentType()).isEqualTo(UPDATED_LINK_DOC_CONTENT_TYPE);
        assertThat(testFinding.getDescHow()).isEqualTo(UPDATED_DESC_HOW);
        assertThat(testFinding.getTypeFinding()).isEqualTo(UPDATED_TYPE_FINDING);
        assertThat(testFinding.getDeptInvol()).isEqualTo(UPDATED_DEPT_INVOL);
        assertThat(testFinding.getIdentificationCause()).isEqualTo(UPDATED_IDENTIFICATION_CAUSE);
        assertThat(testFinding.getCorrectiveAct()).isEqualTo(UPDATED_CORRECTIVE_ACT);
        assertThat(testFinding.getActionDesc()).isEqualTo(UPDATED_ACTION_DESC);

        // Validate the Finding in Elasticsearch
        verify(mockFindingSearchRepository, times(1)).save(testFinding);
    }

    @Test
    @Transactional
    public void updateNonExistingFinding() throws Exception {
        int databaseSizeBeforeUpdate = findingRepository.findAll().size();

        // Create the Finding

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFindingMockMvc.perform(put("/api/findings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(finding)))
            .andExpect(status().isBadRequest());

        // Validate the Finding in the database
        List<Finding> findingList = findingRepository.findAll();
        assertThat(findingList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Finding in Elasticsearch
        verify(mockFindingSearchRepository, times(0)).save(finding);
    }

    @Test
    @Transactional
    public void deleteFinding() throws Exception {
        // Initialize the database
        findingRepository.saveAndFlush(finding);

        int databaseSizeBeforeDelete = findingRepository.findAll().size();

        // Delete the finding
        restFindingMockMvc.perform(delete("/api/findings/{id}", finding.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Finding> findingList = findingRepository.findAll();
        assertThat(findingList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Finding in Elasticsearch
        verify(mockFindingSearchRepository, times(1)).deleteById(finding.getId());
    }

    @Test
    @Transactional
    public void searchFinding() throws Exception {
        // Initialize the database
        findingRepository.saveAndFlush(finding);
        when(mockFindingSearchRepository.search(queryStringQuery("id:" + finding.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(finding), PageRequest.of(0, 1), 1));
        // Search the finding
        restFindingMockMvc.perform(get("/api/_search/findings?query=id:" + finding.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(finding.getId().intValue())))
            .andExpect(jsonPath("$.[*].codFinding").value(hasItem(DEFAULT_COD_FINDING)))
            .andExpect(jsonPath("$.[*].dateStart").value(hasItem(DEFAULT_DATE_START.toString())))
            .andExpect(jsonPath("$.[*].dateEnd").value(hasItem(DEFAULT_DATE_END.toString())))
            .andExpect(jsonPath("$.[*].dateClosure").value(hasItem(DEFAULT_DATE_CLOSURE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].evidence").value(hasItem(DEFAULT_EVIDENCE)))
            .andExpect(jsonPath("$.[*].methodology").value(hasItem(DEFAULT_METHODOLOGY)))
            .andExpect(jsonPath("$.[*].linkDocContentType").value(hasItem(DEFAULT_LINK_DOC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].linkDoc").value(hasItem(Base64Utils.encodeToString(DEFAULT_LINK_DOC))))
            .andExpect(jsonPath("$.[*].descHow").value(hasItem(DEFAULT_DESC_HOW)))
            .andExpect(jsonPath("$.[*].typeFinding").value(hasItem(DEFAULT_TYPE_FINDING)))
            .andExpect(jsonPath("$.[*].deptInvol").value(hasItem(DEFAULT_DEPT_INVOL)))
            .andExpect(jsonPath("$.[*].identificationCause").value(hasItem(DEFAULT_IDENTIFICATION_CAUSE)))
            .andExpect(jsonPath("$.[*].correctiveAct").value(hasItem(DEFAULT_CORRECTIVE_ACT)))
            .andExpect(jsonPath("$.[*].actionDesc").value(hasItem(DEFAULT_ACTION_DESC)));
    }
}
