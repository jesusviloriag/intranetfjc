package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.DocumentState;
import com.jacintoconvit.intranet.repository.DocumentStateRepository;
import com.jacintoconvit.intranet.repository.search.DocumentStateSearchRepository;
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
 * Integration tests for the {@link DocumentStateResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class DocumentStateResourceIT {

    private static final String DEFAULT_NAME_ES = "AAAAAAAAAA";
    private static final String UPDATED_NAME_ES = "BBBBBBBBBB";

    private static final String DEFAULT_NAME_EN = "AAAAAAAAAA";
    private static final String UPDATED_NAME_EN = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION_ES = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION_ES = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION_EN = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION_EN = "BBBBBBBBBB";

    @Autowired
    private DocumentStateRepository documentStateRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.DocumentStateSearchRepositoryMockConfiguration
     */
    @Autowired
    private DocumentStateSearchRepository mockDocumentStateSearchRepository;

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

    private MockMvc restDocumentStateMockMvc;

    private DocumentState documentState;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DocumentStateResource documentStateResource = new DocumentStateResource(documentStateRepository, mockDocumentStateSearchRepository);
        this.restDocumentStateMockMvc = MockMvcBuilders.standaloneSetup(documentStateResource)
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
    public static DocumentState createEntity(EntityManager em) {
        DocumentState documentState = new DocumentState()
            .nameEs(DEFAULT_NAME_ES)
            .nameEn(DEFAULT_NAME_EN)
            .descriptionEs(DEFAULT_DESCRIPTION_ES)
            .descriptionEn(DEFAULT_DESCRIPTION_EN);
        return documentState;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentState createUpdatedEntity(EntityManager em) {
        DocumentState documentState = new DocumentState()
            .nameEs(UPDATED_NAME_ES)
            .nameEn(UPDATED_NAME_EN)
            .descriptionEs(UPDATED_DESCRIPTION_ES)
            .descriptionEn(UPDATED_DESCRIPTION_EN);
        return documentState;
    }

    @BeforeEach
    public void initTest() {
        documentState = createEntity(em);
    }

    @Test
    @Transactional
    public void createDocumentState() throws Exception {
        int databaseSizeBeforeCreate = documentStateRepository.findAll().size();

        // Create the DocumentState
        restDocumentStateMockMvc.perform(post("/api/document-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentState)))
            .andExpect(status().isCreated());

        // Validate the DocumentState in the database
        List<DocumentState> documentStateList = documentStateRepository.findAll();
        assertThat(documentStateList).hasSize(databaseSizeBeforeCreate + 1);
        DocumentState testDocumentState = documentStateList.get(documentStateList.size() - 1);
        assertThat(testDocumentState.getNameEs()).isEqualTo(DEFAULT_NAME_ES);
        assertThat(testDocumentState.getNameEn()).isEqualTo(DEFAULT_NAME_EN);
        assertThat(testDocumentState.getDescriptionEs()).isEqualTo(DEFAULT_DESCRIPTION_ES);
        assertThat(testDocumentState.getDescriptionEn()).isEqualTo(DEFAULT_DESCRIPTION_EN);

        // Validate the DocumentState in Elasticsearch
        verify(mockDocumentStateSearchRepository, times(1)).save(testDocumentState);
    }

    @Test
    @Transactional
    public void createDocumentStateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = documentStateRepository.findAll().size();

        // Create the DocumentState with an existing ID
        documentState.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentStateMockMvc.perform(post("/api/document-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentState)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentState in the database
        List<DocumentState> documentStateList = documentStateRepository.findAll();
        assertThat(documentStateList).hasSize(databaseSizeBeforeCreate);

        // Validate the DocumentState in Elasticsearch
        verify(mockDocumentStateSearchRepository, times(0)).save(documentState);
    }


    @Test
    @Transactional
    public void checkNameEsIsRequired() throws Exception {
        int databaseSizeBeforeTest = documentStateRepository.findAll().size();
        // set the field null
        documentState.setNameEs(null);

        // Create the DocumentState, which fails.

        restDocumentStateMockMvc.perform(post("/api/document-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentState)))
            .andExpect(status().isBadRequest());

        List<DocumentState> documentStateList = documentStateRepository.findAll();
        assertThat(documentStateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDocumentStates() throws Exception {
        // Initialize the database
        documentStateRepository.saveAndFlush(documentState);

        // Get all the documentStateList
        restDocumentStateMockMvc.perform(get("/api/document-states?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentState.getId().intValue())))
            .andExpect(jsonPath("$.[*].nameEs").value(hasItem(DEFAULT_NAME_ES)))
            .andExpect(jsonPath("$.[*].nameEn").value(hasItem(DEFAULT_NAME_EN)))
            .andExpect(jsonPath("$.[*].descriptionEs").value(hasItem(DEFAULT_DESCRIPTION_ES)))
            .andExpect(jsonPath("$.[*].descriptionEn").value(hasItem(DEFAULT_DESCRIPTION_EN)));
    }
    
    @Test
    @Transactional
    public void getDocumentState() throws Exception {
        // Initialize the database
        documentStateRepository.saveAndFlush(documentState);

        // Get the documentState
        restDocumentStateMockMvc.perform(get("/api/document-states/{id}", documentState.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(documentState.getId().intValue()))
            .andExpect(jsonPath("$.nameEs").value(DEFAULT_NAME_ES))
            .andExpect(jsonPath("$.nameEn").value(DEFAULT_NAME_EN))
            .andExpect(jsonPath("$.descriptionEs").value(DEFAULT_DESCRIPTION_ES))
            .andExpect(jsonPath("$.descriptionEn").value(DEFAULT_DESCRIPTION_EN));
    }

    @Test
    @Transactional
    public void getNonExistingDocumentState() throws Exception {
        // Get the documentState
        restDocumentStateMockMvc.perform(get("/api/document-states/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDocumentState() throws Exception {
        // Initialize the database
        documentStateRepository.saveAndFlush(documentState);

        int databaseSizeBeforeUpdate = documentStateRepository.findAll().size();

        // Update the documentState
        DocumentState updatedDocumentState = documentStateRepository.findById(documentState.getId()).get();
        // Disconnect from session so that the updates on updatedDocumentState are not directly saved in db
        em.detach(updatedDocumentState);
        updatedDocumentState
            .nameEs(UPDATED_NAME_ES)
            .nameEn(UPDATED_NAME_EN)
            .descriptionEs(UPDATED_DESCRIPTION_ES)
            .descriptionEn(UPDATED_DESCRIPTION_EN);

        restDocumentStateMockMvc.perform(put("/api/document-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDocumentState)))
            .andExpect(status().isOk());

        // Validate the DocumentState in the database
        List<DocumentState> documentStateList = documentStateRepository.findAll();
        assertThat(documentStateList).hasSize(databaseSizeBeforeUpdate);
        DocumentState testDocumentState = documentStateList.get(documentStateList.size() - 1);
        assertThat(testDocumentState.getNameEs()).isEqualTo(UPDATED_NAME_ES);
        assertThat(testDocumentState.getNameEn()).isEqualTo(UPDATED_NAME_EN);
        assertThat(testDocumentState.getDescriptionEs()).isEqualTo(UPDATED_DESCRIPTION_ES);
        assertThat(testDocumentState.getDescriptionEn()).isEqualTo(UPDATED_DESCRIPTION_EN);

        // Validate the DocumentState in Elasticsearch
        verify(mockDocumentStateSearchRepository, times(1)).save(testDocumentState);
    }

    @Test
    @Transactional
    public void updateNonExistingDocumentState() throws Exception {
        int databaseSizeBeforeUpdate = documentStateRepository.findAll().size();

        // Create the DocumentState

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentStateMockMvc.perform(put("/api/document-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentState)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentState in the database
        List<DocumentState> documentStateList = documentStateRepository.findAll();
        assertThat(documentStateList).hasSize(databaseSizeBeforeUpdate);

        // Validate the DocumentState in Elasticsearch
        verify(mockDocumentStateSearchRepository, times(0)).save(documentState);
    }

    @Test
    @Transactional
    public void deleteDocumentState() throws Exception {
        // Initialize the database
        documentStateRepository.saveAndFlush(documentState);

        int databaseSizeBeforeDelete = documentStateRepository.findAll().size();

        // Delete the documentState
        restDocumentStateMockMvc.perform(delete("/api/document-states/{id}", documentState.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DocumentState> documentStateList = documentStateRepository.findAll();
        assertThat(documentStateList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the DocumentState in Elasticsearch
        verify(mockDocumentStateSearchRepository, times(1)).deleteById(documentState.getId());
    }

    @Test
    @Transactional
    public void searchDocumentState() throws Exception {
        // Initialize the database
        documentStateRepository.saveAndFlush(documentState);
        when(mockDocumentStateSearchRepository.search(queryStringQuery("id:" + documentState.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(documentState), PageRequest.of(0, 1), 1));
        // Search the documentState
        restDocumentStateMockMvc.perform(get("/api/_search/document-states?query=id:" + documentState.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentState.getId().intValue())))
            .andExpect(jsonPath("$.[*].nameEs").value(hasItem(DEFAULT_NAME_ES)))
            .andExpect(jsonPath("$.[*].nameEn").value(hasItem(DEFAULT_NAME_EN)))
            .andExpect(jsonPath("$.[*].descriptionEs").value(hasItem(DEFAULT_DESCRIPTION_ES)))
            .andExpect(jsonPath("$.[*].descriptionEn").value(hasItem(DEFAULT_DESCRIPTION_EN)));
    }
}
