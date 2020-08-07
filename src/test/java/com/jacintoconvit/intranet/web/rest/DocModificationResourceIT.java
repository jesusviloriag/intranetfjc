package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.DocModification;
import com.jacintoconvit.intranet.domain.User;
import com.jacintoconvit.intranet.domain.Document;
import com.jacintoconvit.intranet.repository.DocModificationRepository;
import com.jacintoconvit.intranet.repository.search.DocModificationSearchRepository;
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
 * Integration tests for the {@link DocModificationResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class DocModificationResourceIT {

    private static final LocalDate DEFAULT_DATE_MOD = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_MOD = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_COMMIT = "AAAAAAAAAA";
    private static final String UPDATED_COMMIT = "BBBBBBBBBB";

    private static final String DEFAULT_VERSION = "AAAAAAAAAA";
    private static final String UPDATED_VERSION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_DOC = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DOC = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DOC_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DOC_CONTENT_TYPE = "image/png";

    @Autowired
    private DocModificationRepository docModificationRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.DocModificationSearchRepositoryMockConfiguration
     */
    @Autowired
    private DocModificationSearchRepository mockDocModificationSearchRepository;

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

    private MockMvc restDocModificationMockMvc;

    private DocModification docModification;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DocModificationResource docModificationResource = new DocModificationResource(docModificationRepository, mockDocModificationSearchRepository);
        this.restDocModificationMockMvc = MockMvcBuilders.standaloneSetup(docModificationResource)
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
    public static DocModification createEntity(EntityManager em) {
        DocModification docModification = new DocModification()
            .dateMod(DEFAULT_DATE_MOD)
            .commit(DEFAULT_COMMIT)
            .version(DEFAULT_VERSION)
            .doc(DEFAULT_DOC)
            .docContentType(DEFAULT_DOC_CONTENT_TYPE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        docModification.setAuthor(user);
        // Add required entity
        Document document;
        if (TestUtil.findAll(em, Document.class).isEmpty()) {
            document = DocumentResourceIT.createEntity(em);
            em.persist(document);
            em.flush();
        } else {
            document = TestUtil.findAll(em, Document.class).get(0);
        }
        docModification.setDocMod(document);
        return docModification;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocModification createUpdatedEntity(EntityManager em) {
        DocModification docModification = new DocModification()
            .dateMod(UPDATED_DATE_MOD)
            .commit(UPDATED_COMMIT)
            .version(UPDATED_VERSION)
            .doc(UPDATED_DOC)
            .docContentType(UPDATED_DOC_CONTENT_TYPE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        docModification.setAuthor(user);
        // Add required entity
        Document document;
        if (TestUtil.findAll(em, Document.class).isEmpty()) {
            document = DocumentResourceIT.createUpdatedEntity(em);
            em.persist(document);
            em.flush();
        } else {
            document = TestUtil.findAll(em, Document.class).get(0);
        }
        docModification.setDocMod(document);
        return docModification;
    }

    @BeforeEach
    public void initTest() {
        docModification = createEntity(em);
    }

    @Test
    @Transactional
    public void createDocModification() throws Exception {
        int databaseSizeBeforeCreate = docModificationRepository.findAll().size();

        // Create the DocModification
        restDocModificationMockMvc.perform(post("/api/doc-modifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(docModification)))
            .andExpect(status().isCreated());

        // Validate the DocModification in the database
        List<DocModification> docModificationList = docModificationRepository.findAll();
        assertThat(docModificationList).hasSize(databaseSizeBeforeCreate + 1);
        DocModification testDocModification = docModificationList.get(docModificationList.size() - 1);
        assertThat(testDocModification.getDateMod()).isEqualTo(DEFAULT_DATE_MOD);
        assertThat(testDocModification.getCommit()).isEqualTo(DEFAULT_COMMIT);
        assertThat(testDocModification.getVersion()).isEqualTo(DEFAULT_VERSION);
        assertThat(testDocModification.getDoc()).isEqualTo(DEFAULT_DOC);
        assertThat(testDocModification.getDocContentType()).isEqualTo(DEFAULT_DOC_CONTENT_TYPE);

        // Validate the DocModification in Elasticsearch
        verify(mockDocModificationSearchRepository, times(1)).save(testDocModification);
    }

    @Test
    @Transactional
    public void createDocModificationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = docModificationRepository.findAll().size();

        // Create the DocModification with an existing ID
        docModification.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocModificationMockMvc.perform(post("/api/doc-modifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(docModification)))
            .andExpect(status().isBadRequest());

        // Validate the DocModification in the database
        List<DocModification> docModificationList = docModificationRepository.findAll();
        assertThat(docModificationList).hasSize(databaseSizeBeforeCreate);

        // Validate the DocModification in Elasticsearch
        verify(mockDocModificationSearchRepository, times(0)).save(docModification);
    }


    @Test
    @Transactional
    public void getAllDocModifications() throws Exception {
        // Initialize the database
        docModificationRepository.saveAndFlush(docModification);

        // Get all the docModificationList
        restDocModificationMockMvc.perform(get("/api/doc-modifications?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(docModification.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateMod").value(hasItem(DEFAULT_DATE_MOD.toString())))
            .andExpect(jsonPath("$.[*].commit").value(hasItem(DEFAULT_COMMIT)))
            .andExpect(jsonPath("$.[*].version").value(hasItem(DEFAULT_VERSION)))
            .andExpect(jsonPath("$.[*].docContentType").value(hasItem(DEFAULT_DOC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].doc").value(hasItem(Base64Utils.encodeToString(DEFAULT_DOC))));
    }
    
    @Test
    @Transactional
    public void getDocModification() throws Exception {
        // Initialize the database
        docModificationRepository.saveAndFlush(docModification);

        // Get the docModification
        restDocModificationMockMvc.perform(get("/api/doc-modifications/{id}", docModification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(docModification.getId().intValue()))
            .andExpect(jsonPath("$.dateMod").value(DEFAULT_DATE_MOD.toString()))
            .andExpect(jsonPath("$.commit").value(DEFAULT_COMMIT))
            .andExpect(jsonPath("$.version").value(DEFAULT_VERSION))
            .andExpect(jsonPath("$.docContentType").value(DEFAULT_DOC_CONTENT_TYPE))
            .andExpect(jsonPath("$.doc").value(Base64Utils.encodeToString(DEFAULT_DOC)));
    }

    @Test
    @Transactional
    public void getNonExistingDocModification() throws Exception {
        // Get the docModification
        restDocModificationMockMvc.perform(get("/api/doc-modifications/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDocModification() throws Exception {
        // Initialize the database
        docModificationRepository.saveAndFlush(docModification);

        int databaseSizeBeforeUpdate = docModificationRepository.findAll().size();

        // Update the docModification
        DocModification updatedDocModification = docModificationRepository.findById(docModification.getId()).get();
        // Disconnect from session so that the updates on updatedDocModification are not directly saved in db
        em.detach(updatedDocModification);
        updatedDocModification
            .dateMod(UPDATED_DATE_MOD)
            .commit(UPDATED_COMMIT)
            .version(UPDATED_VERSION)
            .doc(UPDATED_DOC)
            .docContentType(UPDATED_DOC_CONTENT_TYPE);

        restDocModificationMockMvc.perform(put("/api/doc-modifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDocModification)))
            .andExpect(status().isOk());

        // Validate the DocModification in the database
        List<DocModification> docModificationList = docModificationRepository.findAll();
        assertThat(docModificationList).hasSize(databaseSizeBeforeUpdate);
        DocModification testDocModification = docModificationList.get(docModificationList.size() - 1);
        assertThat(testDocModification.getDateMod()).isEqualTo(UPDATED_DATE_MOD);
        assertThat(testDocModification.getCommit()).isEqualTo(UPDATED_COMMIT);
        assertThat(testDocModification.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testDocModification.getDoc()).isEqualTo(UPDATED_DOC);
        assertThat(testDocModification.getDocContentType()).isEqualTo(UPDATED_DOC_CONTENT_TYPE);

        // Validate the DocModification in Elasticsearch
        verify(mockDocModificationSearchRepository, times(1)).save(testDocModification);
    }

    @Test
    @Transactional
    public void updateNonExistingDocModification() throws Exception {
        int databaseSizeBeforeUpdate = docModificationRepository.findAll().size();

        // Create the DocModification

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocModificationMockMvc.perform(put("/api/doc-modifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(docModification)))
            .andExpect(status().isBadRequest());

        // Validate the DocModification in the database
        List<DocModification> docModificationList = docModificationRepository.findAll();
        assertThat(docModificationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the DocModification in Elasticsearch
        verify(mockDocModificationSearchRepository, times(0)).save(docModification);
    }

    @Test
    @Transactional
    public void deleteDocModification() throws Exception {
        // Initialize the database
        docModificationRepository.saveAndFlush(docModification);

        int databaseSizeBeforeDelete = docModificationRepository.findAll().size();

        // Delete the docModification
        restDocModificationMockMvc.perform(delete("/api/doc-modifications/{id}", docModification.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DocModification> docModificationList = docModificationRepository.findAll();
        assertThat(docModificationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the DocModification in Elasticsearch
        verify(mockDocModificationSearchRepository, times(1)).deleteById(docModification.getId());
    }

    @Test
    @Transactional
    public void searchDocModification() throws Exception {
        // Initialize the database
        docModificationRepository.saveAndFlush(docModification);
        when(mockDocModificationSearchRepository.search(queryStringQuery("id:" + docModification.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(docModification), PageRequest.of(0, 1), 1));
        // Search the docModification
        restDocModificationMockMvc.perform(get("/api/_search/doc-modifications?query=id:" + docModification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(docModification.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateMod").value(hasItem(DEFAULT_DATE_MOD.toString())))
            .andExpect(jsonPath("$.[*].commit").value(hasItem(DEFAULT_COMMIT)))
            .andExpect(jsonPath("$.[*].version").value(hasItem(DEFAULT_VERSION)))
            .andExpect(jsonPath("$.[*].docContentType").value(hasItem(DEFAULT_DOC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].doc").value(hasItem(Base64Utils.encodeToString(DEFAULT_DOC))));
    }
}
