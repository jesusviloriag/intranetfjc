package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.domain.DocumentType;
import com.jacintoconvit.intranet.repository.DocumentTypeRepository;
import com.jacintoconvit.intranet.repository.search.DocumentTypeSearchRepository;
import com.jacintoconvit.intranet.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.DocumentType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DocumentTypeResource {

    private final Logger log = LoggerFactory.getLogger(DocumentTypeResource.class);

    private static final String ENTITY_NAME = "documentType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentTypeRepository documentTypeRepository;

    private final DocumentTypeSearchRepository documentTypeSearchRepository;

    public DocumentTypeResource(DocumentTypeRepository documentTypeRepository, DocumentTypeSearchRepository documentTypeSearchRepository) {
        this.documentTypeRepository = documentTypeRepository;
        this.documentTypeSearchRepository = documentTypeSearchRepository;
    }

    /**
     * {@code POST  /document-types} : Create a new documentType.
     *
     * @param documentType the documentType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentType, or with status {@code 400 (Bad Request)} if the documentType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/document-types")
    public ResponseEntity<DocumentType> createDocumentType(@Valid @RequestBody DocumentType documentType) throws URISyntaxException {
        log.debug("REST request to save DocumentType : {}", documentType);
        if (documentType.getId() != null) {
            throw new BadRequestAlertException("A new documentType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DocumentType result = documentTypeRepository.save(documentType);
        documentTypeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/document-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /document-types} : Updates an existing documentType.
     *
     * @param documentType the documentType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentType,
     * or with status {@code 400 (Bad Request)} if the documentType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/document-types")
    public ResponseEntity<DocumentType> updateDocumentType(@Valid @RequestBody DocumentType documentType) throws URISyntaxException {
        log.debug("REST request to update DocumentType : {}", documentType);
        if (documentType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DocumentType result = documentTypeRepository.save(documentType);
        documentTypeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentType.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /document-types} : get all the documentTypes.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentTypes in body.
     */
    @GetMapping("/document-types")
    public ResponseEntity<List<DocumentType>> getAllDocumentTypes(Pageable pageable) {
        log.debug("REST request to get a page of DocumentTypes");
        Page<DocumentType> page = documentTypeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /document-types/:id} : get the "id" documentType.
     *
     * @param id the id of the documentType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documentType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/document-types/{id}")
    public ResponseEntity<DocumentType> getDocumentType(@PathVariable Long id) {
        log.debug("REST request to get DocumentType : {}", id);
        Optional<DocumentType> documentType = documentTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(documentType);
    }

    /**
     * {@code DELETE  /document-types/:id} : delete the "id" documentType.
     *
     * @param id the id of the documentType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/document-types/{id}")
    public ResponseEntity<Void> deleteDocumentType(@PathVariable Long id) {
        log.debug("REST request to delete DocumentType : {}", id);
        documentTypeRepository.deleteById(id);
        documentTypeSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/document-types?query=:query} : search for the documentType corresponding
     * to the query.
     *
     * @param query the query of the documentType search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/document-types")
    public ResponseEntity<List<DocumentType>> searchDocumentTypes(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of DocumentTypes for query {}", query);
        Page<DocumentType> page = documentTypeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
