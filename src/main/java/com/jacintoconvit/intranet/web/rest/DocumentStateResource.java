package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.domain.DocumentState;
import com.jacintoconvit.intranet.repository.DocumentStateRepository;
import com.jacintoconvit.intranet.repository.search.DocumentStateSearchRepository;
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
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.DocumentState}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DocumentStateResource {

    private final Logger log = LoggerFactory.getLogger(DocumentStateResource.class);

    private static final String ENTITY_NAME = "documentState";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentStateRepository documentStateRepository;

    private final DocumentStateSearchRepository documentStateSearchRepository;

    public DocumentStateResource(DocumentStateRepository documentStateRepository, DocumentStateSearchRepository documentStateSearchRepository) {
        this.documentStateRepository = documentStateRepository;
        this.documentStateSearchRepository = documentStateSearchRepository;
    }

    /**
     * {@code POST  /document-states} : Create a new documentState.
     *
     * @param documentState the documentState to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentState, or with status {@code 400 (Bad Request)} if the documentState has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/document-states")
    public ResponseEntity<DocumentState> createDocumentState(@Valid @RequestBody DocumentState documentState) throws URISyntaxException {
        log.debug("REST request to save DocumentState : {}", documentState);
        if (documentState.getId() != null) {
            throw new BadRequestAlertException("A new documentState cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DocumentState result = documentStateRepository.save(documentState);
        documentStateSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/document-states/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /document-states} : Updates an existing documentState.
     *
     * @param documentState the documentState to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentState,
     * or with status {@code 400 (Bad Request)} if the documentState is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentState couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/document-states")
    public ResponseEntity<DocumentState> updateDocumentState(@Valid @RequestBody DocumentState documentState) throws URISyntaxException {
        log.debug("REST request to update DocumentState : {}", documentState);
        if (documentState.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DocumentState result = documentStateRepository.save(documentState);
        documentStateSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentState.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /document-states} : get all the documentStates.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentStates in body.
     */
    @GetMapping("/document-states")
    public ResponseEntity<List<DocumentState>> getAllDocumentStates(Pageable pageable) {
        log.debug("REST request to get a page of DocumentStates");
        Page<DocumentState> page = documentStateRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /document-states/:id} : get the "id" documentState.
     *
     * @param id the id of the documentState to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documentState, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/document-states/{id}")
    public ResponseEntity<DocumentState> getDocumentState(@PathVariable Long id) {
        log.debug("REST request to get DocumentState : {}", id);
        Optional<DocumentState> documentState = documentStateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(documentState);
    }

    /**
     * {@code DELETE  /document-states/:id} : delete the "id" documentState.
     *
     * @param id the id of the documentState to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/document-states/{id}")
    public ResponseEntity<Void> deleteDocumentState(@PathVariable Long id) {
        log.debug("REST request to delete DocumentState : {}", id);
        documentStateRepository.deleteById(id);
        documentStateSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/document-states?query=:query} : search for the documentState corresponding
     * to the query.
     *
     * @param query the query of the documentState search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/document-states")
    public ResponseEntity<List<DocumentState>> searchDocumentStates(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of DocumentStates for query {}", query);
        Page<DocumentState> page = documentStateSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
