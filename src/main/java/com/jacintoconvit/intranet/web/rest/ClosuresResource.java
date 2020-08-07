package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.domain.Closures;
import com.jacintoconvit.intranet.repository.ClosuresRepository;
import com.jacintoconvit.intranet.repository.search.ClosuresSearchRepository;
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
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.Closures}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClosuresResource {

    private final Logger log = LoggerFactory.getLogger(ClosuresResource.class);

    private static final String ENTITY_NAME = "closures";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClosuresRepository closuresRepository;

    private final ClosuresSearchRepository closuresSearchRepository;

    public ClosuresResource(ClosuresRepository closuresRepository, ClosuresSearchRepository closuresSearchRepository) {
        this.closuresRepository = closuresRepository;
        this.closuresSearchRepository = closuresSearchRepository;
    }

    /**
     * {@code POST  /closures} : Create a new closures.
     *
     * @param closures the closures to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new closures, or with status {@code 400 (Bad Request)} if the closures has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/closures")
    public ResponseEntity<Closures> createClosures(@Valid @RequestBody Closures closures) throws URISyntaxException {
        log.debug("REST request to save Closures : {}", closures);
        if (closures.getId() != null) {
            throw new BadRequestAlertException("A new closures cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Closures result = closuresRepository.save(closures);
        closuresSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/closures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /closures} : Updates an existing closures.
     *
     * @param closures the closures to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated closures,
     * or with status {@code 400 (Bad Request)} if the closures is not valid,
     * or with status {@code 500 (Internal Server Error)} if the closures couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/closures")
    public ResponseEntity<Closures> updateClosures(@Valid @RequestBody Closures closures) throws URISyntaxException {
        log.debug("REST request to update Closures : {}", closures);
        if (closures.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Closures result = closuresRepository.save(closures);
        closuresSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, closures.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /closures} : get all the closures.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of closures in body.
     */
    @GetMapping("/closures")
    public ResponseEntity<List<Closures>> getAllClosures(Pageable pageable) {
        log.debug("REST request to get a page of Closures");
        Page<Closures> page = closuresRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /closures/load={all}} : get all the closures.
     *

     * @param pageable the pagination information.
     * @param all
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of closures in body.
     */
    @GetMapping("/closures/load={all}")
    public ResponseEntity<List<Closures>> getAllClosures(@PathVariable String all) {
        log.debug("REST request to get all Closures");
        Pageable pageable = Pageable.unpaged();
        Page<Closures> page = closuresRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

        /**
     * {@code GET  /closures/idClosure=${id}} : get an closure by the findingId.
     *

     * @param pageable the pagination information.
     * @param id
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of closures in body.
     */
    @GetMapping("/closures/idClosure={id}")
    public ResponseEntity<List<Closures>> getClosureByFindId(@PathVariable long id) {
        log.debug("REST request to get all Closures");
        Pageable pageable = Pageable.unpaged();
        Page<Closures> page = closuresRepository.findByIdFinding(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /closures/:id} : get the "id" closures.
     *
     * @param id the id of the closures to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the closures, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/closures/{id}")
    public ResponseEntity<Closures> getClosures(@PathVariable Long id) {
        log.debug("REST request to get Closures : {}", id);
        Optional<Closures> closures = closuresRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(closures);
    }

    /**
     * {@code DELETE  /closures/:id} : delete the "id" closures.
     *
     * @param id the id of the closures to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/closures/{id}")
    public ResponseEntity<Void> deleteClosures(@PathVariable Long id) {
        log.debug("REST request to delete Closures : {}", id);
        closuresRepository.deleteById(id);
        closuresSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/closures?query=:query} : search for the closures corresponding
     * to the query.
     *
     * @param query the query of the closures search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/closures")
    public ResponseEntity<List<Closures>> searchClosures(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Closures for query {}", query);
        Page<Closures> page = closuresSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
