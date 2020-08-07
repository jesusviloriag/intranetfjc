package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.domain.DocModification;
import com.jacintoconvit.intranet.repository.DocModificationRepository;
import com.jacintoconvit.intranet.repository.search.DocModificationSearchRepository;
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
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.DocModification}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DocModificationResource {

    private final Logger log = LoggerFactory.getLogger(DocModificationResource.class);

    private static final String ENTITY_NAME = "docModification";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocModificationRepository docModificationRepository;

    private final DocModificationSearchRepository docModificationSearchRepository;

    public DocModificationResource(DocModificationRepository docModificationRepository, DocModificationSearchRepository docModificationSearchRepository) {
        this.docModificationRepository = docModificationRepository;
        this.docModificationSearchRepository = docModificationSearchRepository;
    }

    /**
     * {@code POST  /doc-modifications} : Create a new docModification.
     *
     * @param docModification the docModification to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new docModification, or with status {@code 400 (Bad Request)} if the docModification has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/doc-modifications")
    public ResponseEntity<DocModification> createDocModification(@Valid @RequestBody DocModification docModification) throws URISyntaxException {
        log.debug("REST request to save DocModification : {}", docModification);
        if (docModification.getId() != null) {
            throw new BadRequestAlertException("A new docModification cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DocModification result = docModificationRepository.save(docModification);
        docModificationSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/doc-modifications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /doc-modifications} : Updates an existing docModification.
     *
     * @param docModification the docModification to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated docModification,
     * or with status {@code 400 (Bad Request)} if the docModification is not valid,
     * or with status {@code 500 (Internal Server Error)} if the docModification couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/doc-modifications")
    public ResponseEntity<DocModification> updateDocModification(@Valid @RequestBody DocModification docModification) throws URISyntaxException {
        log.debug("REST request to update DocModification : {}", docModification);
        if (docModification.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DocModification result = docModificationRepository.save(docModification);
        docModificationSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, docModification.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /doc-modifications} : get all the docModifications.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of docModifications in body.
     */
    @GetMapping("/doc-modifications")
    public ResponseEntity<List<DocModification>> getAllDocModifications(Pageable pageable) {
        log.debug("REST request to get a page of DocModifications");
        Page<DocModification> page = docModificationRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

     /**
     * {@code GET  /action-findings/actId={id}} : get all the actionFindings.
     *

     * @param pageable the pagination information.
     * @param id
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actionFindings in body.
     */
    @GetMapping("/doc-modifications/find={id}")
    public ResponseEntity<List<DocModification>> getAllModificationByRel(@PathVariable long id) {
        log.debug("REST request to get All the doc modifications by the id Document");
        Pageable pageable = Pageable.unpaged();
        Page<DocModification> page = docModificationRepository.findByDocModification(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
    * {@code GET  /action-findings/actId={id}} : get all the actionFindings.
    *

    * @param pageable the pagination information.
    * @param id
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actionFindings in body.
    */
   @GetMapping("/doc-modifications/last={id}")
   public ResponseEntity<List<DocModification>> getAllModificationByRel(@PathVariable long id, Pageable pageable) {
       log.debug("REST request to get All the doc modifications by the id Document");
       pageable = PageRequest.of(0, 1, Sort.by("id").descending());
       Page<DocModification> page = docModificationRepository.findByDocModId(id, pageable);
       HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
       return ResponseEntity.ok().headers(headers).body(page.getContent());
   }

    /**
     * {@code GET  /doc-modifications/:id} : get the "id" docModification.
     *
     * @param id the id of the docModification to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the docModification, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/doc-modifications/{id}")
    public ResponseEntity<DocModification> getDocModification(@PathVariable Long id) {
        log.debug("REST request to get DocModification : {}", id);
        Optional<DocModification> docModification = docModificationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(docModification);
    }

    /**
     * {@code DELETE  /doc-modifications/:id} : delete the "id" docModification.
     *
     * @param id the id of the docModification to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/doc-modifications/{id}")
    public ResponseEntity<Void> deleteDocModification(@PathVariable Long id) {
        log.debug("REST request to delete DocModification : {}", id);
        docModificationRepository.deleteById(id);
        docModificationSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/doc-modifications?query=:query} : search for the docModification corresponding
     * to the query.
     *
     * @param query the query of the docModification search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/doc-modifications")
    public ResponseEntity<List<DocModification>> searchDocModifications(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of DocModifications for query {}", query);
        Page<DocModification> page = docModificationSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
