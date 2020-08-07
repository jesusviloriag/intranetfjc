package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.Document;
import com.jacintoconvit.intranet.domain.Departament;
import com.jacintoconvit.intranet.domain.DocumentType;
import com.jacintoconvit.intranet.repository.DocumentRepository;
import com.jacintoconvit.intranet.repository.search.DocumentSearchRepository;
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
 * Integration tests for the {@link DocumentResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class DocumentResourceIT {

    private static final String DEFAULT_COD_DOC = "AAAAAAAAAA";
    private static final String UPDATED_COD_DOC = "BBBBBBBBBB";

    private static final String DEFAULT_NAME_DOC = "AAAAAAAAAA";
    private static final String UPDATED_NAME_DOC = "BBBBBBBBBB";

    private static final String DEFAULT_STORAGE = "AAAAAAAAAA";
    private static final String UPDATED_STORAGE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_CREATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CREATION = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DURATION = "AAAAAAAAAA";
    private static final String UPDATED_DURATION = "BBBBBBBBBB";

    private static final String DEFAULT_FINAL_DISPOSITION = "AAAAAAAAAA";
    private static final String UPDATED_FINAL_DISPOSITION = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORIGIN = 1;
    private static final Integer UPDATED_ORIGIN = 2;

    private static final byte[] DEFAULT_DOC = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DOC = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DOC_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DOC_CONTENT_TYPE = "image/png";

    @Autowired
    private DocumentRepository documentRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.DocumentSearchRepositoryMockConfiguration
     */
    @Autowired
    private DocumentSearchRepository mockDocumentSearchRepository;

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

    private MockMvc restDocumentMockMvc;

    private Document document;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DocumentResource documentResource = new DocumentResource(documentRepository, mockDocumentSearchRepository);
        this.restDocumentMockMvc = MockMvcBuilders.standaloneSetup(documentResource)
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
    public static Document createEntity(EntityManager em) {
        Document document = new Document()
            .codDoc(DEFAULT_COD_DOC)
            .nameDoc(DEFAULT_NAME_DOC)
            .storage(DEFAULT_STORAGE)
            .dateCreation(DEFAULT_DATE_CREATION)
            .duration(DEFAULT_DURATION)
            .finalDisposition(DEFAULT_FINAL_DISPOSITION)
            .origin(DEFAULT_ORIGIN)
            .doc(DEFAULT_DOC)
            .docContentType(DEFAULT_DOC_CONTENT_TYPE);
        // Add required entity
        Departament departament;
        if (TestUtil.findAll(em, Departament.class).isEmpty()) {
            departament = DepartamentResourceIT.createEntity(em);
            em.persist(departament);
            em.flush();
        } else {
            departament = TestUtil.findAll(em, Departament.class).get(0);
        }
        document.setDepartament(departament);
        // Add required entity
        DocumentType documentType;
        if (TestUtil.findAll(em, DocumentType.class).isEmpty()) {
            documentType = DocumentTypeResourceIT.createEntity(em);
            em.persist(documentType);
            em.flush();
        } else {
            documentType = TestUtil.findAll(em, DocumentType.class).get(0);
        }
        document.setType(documentType);
        return document;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Document createUpdatedEntity(EntityManager em) {
        Document document = new Document()
            .codDoc(UPDATED_COD_DOC)
            .nameDoc(UPDATED_NAME_DOC)
            .storage(UPDATED_STORAGE)
            .dateCreation(UPDATED_DATE_CREATION)
            .duration(UPDATED_DURATION)
            .finalDisposition(UPDATED_FINAL_DISPOSITION)
            .origin(UPDATED_ORIGIN)
            .doc(UPDATED_DOC)
            .docContentType(UPDATED_DOC_CONTENT_TYPE);
        // Add required entity
        Departament departament;
        if (TestUtil.findAll(em, Departament.class).isEmpty()) {
            departament = DepartamentResourceIT.createUpdatedEntity(em);
            em.persist(departament);
            em.flush();
        } else {
            departament = TestUtil.findAll(em, Departament.class).get(0);
        }
        document.setDepartament(departament);
        // Add required entity
        DocumentType documentType;
        if (TestUtil.findAll(em, DocumentType.class).isEmpty()) {
            documentType = DocumentTypeResourceIT.createUpdatedEntity(em);
            em.persist(documentType);
            em.flush();
        } else {
            documentType = TestUtil.findAll(em, DocumentType.class).get(0);
        }
        document.setType(documentType);
        return document;
    }

    @BeforeEach
    public void initTest() {
        document = createEntity(em);
    }

    @Test
    @Transactional
    public void createDocument() throws Exception {
        int databaseSizeBeforeCreate = documentRepository.findAll().size();

        // Create the Document
        restDocumentMockMvc.perform(post("/api/documents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(document)))
            .andExpect(status().isCreated());

        // Validate the Document in the database
        List<Document> documentList = documentRepository.findAll();
        assertThat(documentList).hasSize(databaseSizeBeforeCreate + 1);
        Document testDocument = documentList.get(documentList.size() - 1);
        assertThat(testDocument.getCodDoc()).isEqualTo(DEFAULT_COD_DOC);
        assertThat(testDocument.getNameDoc()).isEqualTo(DEFAULT_NAME_DOC);
        assertThat(testDocument.getStorage()).isEqualTo(DEFAULT_STORAGE);
        assertThat(testDocument.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testDocument.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testDocument.getFinalDisposition()).isEqualTo(DEFAULT_FINAL_DISPOSITION);
        assertThat(testDocument.getOrigin()).isEqualTo(DEFAULT_ORIGIN);
        assertThat(testDocument.getDoc()).isEqualTo(DEFAULT_DOC);
        assertThat(testDocument.getDocContentType()).isEqualTo(DEFAULT_DOC_CONTENT_TYPE);

        // Validate the Document in Elasticsearch
        verify(mockDocumentSearchRepository, times(1)).save(testDocument);
    }

    @Test
    @Transactional
    public void createDocumentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = documentRepository.findAll().size();

        // Create the Document with an existing ID
        document.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentMockMvc.perform(post("/api/documents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(document)))
            .andExpect(status().isBadRequest());

        // Validate the Document in the database
        List<Document> documentList = documentRepository.findAll();
        assertThat(documentList).hasSize(databaseSizeBeforeCreate);

        // Validate the Document in Elasticsearch
        verify(mockDocumentSearchRepository, times(0)).save(document);
    }


    @Test
    @Transactional
    public void checkCodDocIsRequired() throws Exception {
        int databaseSizeBeforeTest = documentRepository.findAll().size();
        // set the field null
        document.setCodDoc(null);

        // Create the Document, which fails.

        restDocumentMockMvc.perform(post("/api/documents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(document)))
            .andExpect(status().isBadRequest());

        List<Document> documentList = documentRepository.findAll();
        assertThat(documentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDocuments() throws Exception {
        // Initialize the database
        documentRepository.saveAndFlush(document);

        // Get all the documentList
        restDocumentMockMvc.perform(get("/api/documents?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(document.getId().intValue())))
            .andExpect(jsonPath("$.[*].codDoc").value(hasItem(DEFAULT_COD_DOC)))
            .andExpect(jsonPath("$.[*].nameDoc").value(hasItem(DEFAULT_NAME_DOC)))
            .andExpect(jsonPath("$.[*].storage").value(hasItem(DEFAULT_STORAGE)))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].finalDisposition").value(hasItem(DEFAULT_FINAL_DISPOSITION)))
            .andExpect(jsonPath("$.[*].origin").value(hasItem(DEFAULT_ORIGIN)))
            .andExpect(jsonPath("$.[*].docContentType").value(hasItem(DEFAULT_DOC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].doc").value(hasItem(Base64Utils.encodeToString(DEFAULT_DOC))));
    }
    
    @Test
    @Transactional
    public void getDocument() throws Exception {
        // Initialize the database
        documentRepository.saveAndFlush(document);

        // Get the document
        restDocumentMockMvc.perform(get("/api/documents/{id}", document.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(document.getId().intValue()))
            .andExpect(jsonPath("$.codDoc").value(DEFAULT_COD_DOC))
            .andExpect(jsonPath("$.nameDoc").value(DEFAULT_NAME_DOC))
            .andExpect(jsonPath("$.storage").value(DEFAULT_STORAGE))
            .andExpect(jsonPath("$.dateCreation").value(DEFAULT_DATE_CREATION.toString()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.finalDisposition").value(DEFAULT_FINAL_DISPOSITION))
            .andExpect(jsonPath("$.origin").value(DEFAULT_ORIGIN))
            .andExpect(jsonPath("$.docContentType").value(DEFAULT_DOC_CONTENT_TYPE))
            .andExpect(jsonPath("$.doc").value(Base64Utils.encodeToString(DEFAULT_DOC)));
    }

    @Test
    @Transactional
    public void getNonExistingDocument() throws Exception {
        // Get the document
        restDocumentMockMvc.perform(get("/api/documents/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDocument() throws Exception {
        // Initialize the database
        documentRepository.saveAndFlush(document);

        int databaseSizeBeforeUpdate = documentRepository.findAll().size();

        // Update the document
        Document updatedDocument = documentRepository.findById(document.getId()).get();
        // Disconnect from session so that the updates on updatedDocument are not directly saved in db
        em.detach(updatedDocument);
        updatedDocument
            .codDoc(UPDATED_COD_DOC)
            .nameDoc(UPDATED_NAME_DOC)
            .storage(UPDATED_STORAGE)
            .dateCreation(UPDATED_DATE_CREATION)
            .duration(UPDATED_DURATION)
            .finalDisposition(UPDATED_FINAL_DISPOSITION)
            .origin(UPDATED_ORIGIN)
            .doc(UPDATED_DOC)
            .docContentType(UPDATED_DOC_CONTENT_TYPE);

        restDocumentMockMvc.perform(put("/api/documents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDocument)))
            .andExpect(status().isOk());

        // Validate the Document in the database
        List<Document> documentList = documentRepository.findAll();
        assertThat(documentList).hasSize(databaseSizeBeforeUpdate);
        Document testDocument = documentList.get(documentList.size() - 1);
        assertThat(testDocument.getCodDoc()).isEqualTo(UPDATED_COD_DOC);
        assertThat(testDocument.getNameDoc()).isEqualTo(UPDATED_NAME_DOC);
        assertThat(testDocument.getStorage()).isEqualTo(UPDATED_STORAGE);
        assertThat(testDocument.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testDocument.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testDocument.getFinalDisposition()).isEqualTo(UPDATED_FINAL_DISPOSITION);
        assertThat(testDocument.getOrigin()).isEqualTo(UPDATED_ORIGIN);
        assertThat(testDocument.getDoc()).isEqualTo(UPDATED_DOC);
        assertThat(testDocument.getDocContentType()).isEqualTo(UPDATED_DOC_CONTENT_TYPE);

        // Validate the Document in Elasticsearch
        verify(mockDocumentSearchRepository, times(1)).save(testDocument);
    }

    @Test
    @Transactional
    public void updateNonExistingDocument() throws Exception {
        int databaseSizeBeforeUpdate = documentRepository.findAll().size();

        // Create the Document

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentMockMvc.perform(put("/api/documents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(document)))
            .andExpect(status().isBadRequest());

        // Validate the Document in the database
        List<Document> documentList = documentRepository.findAll();
        assertThat(documentList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Document in Elasticsearch
        verify(mockDocumentSearchRepository, times(0)).save(document);
    }

    @Test
    @Transactional
    public void deleteDocument() throws Exception {
        // Initialize the database
        documentRepository.saveAndFlush(document);

        int databaseSizeBeforeDelete = documentRepository.findAll().size();

        // Delete the document
        restDocumentMockMvc.perform(delete("/api/documents/{id}", document.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Document> documentList = documentRepository.findAll();
        assertThat(documentList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Document in Elasticsearch
        verify(mockDocumentSearchRepository, times(1)).deleteById(document.getId());
    }

    @Test
    @Transactional
    public void searchDocument() throws Exception {
        // Initialize the database
        documentRepository.saveAndFlush(document);
        when(mockDocumentSearchRepository.search(queryStringQuery("id:" + document.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(document), PageRequest.of(0, 1), 1));
        // Search the document
        restDocumentMockMvc.perform(get("/api/_search/documents?query=id:" + document.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(document.getId().intValue())))
            .andExpect(jsonPath("$.[*].codDoc").value(hasItem(DEFAULT_COD_DOC)))
            .andExpect(jsonPath("$.[*].nameDoc").value(hasItem(DEFAULT_NAME_DOC)))
            .andExpect(jsonPath("$.[*].storage").value(hasItem(DEFAULT_STORAGE)))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].finalDisposition").value(hasItem(DEFAULT_FINAL_DISPOSITION)))
            .andExpect(jsonPath("$.[*].origin").value(hasItem(DEFAULT_ORIGIN)))
            .andExpect(jsonPath("$.[*].docContentType").value(hasItem(DEFAULT_DOC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].doc").value(hasItem(Base64Utils.encodeToString(DEFAULT_DOC))));
    }
}
