package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.domain.ActionFinding;
import com.jacintoconvit.intranet.repository.ActionFindingRepository;
import com.jacintoconvit.intranet.repository.search.ActionFindingSearchRepository;
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
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.ActionFinding}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActionFindingResource {

    private final Logger log = LoggerFactory.getLogger(ActionFindingResource.class);

    private static final String ENTITY_NAME = "actionFinding";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActionFindingRepository actionFindingRepository;

    private final ActionFindingSearchRepository actionFindingSearchRepository;

    public ActionFindingResource(ActionFindingRepository actionFindingRepository, ActionFindingSearchRepository actionFindingSearchRepository) {
        this.actionFindingRepository = actionFindingRepository;
        this.actionFindingSearchRepository = actionFindingSearchRepository;
    }

    /**
     * {@code POST  /action-findings} : Create a new actionFinding.
     *
     * @param actionFinding the actionFinding to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actionFinding, or with status {@code 400 (Bad Request)} if the actionFinding has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/action-findings")
    public ResponseEntity<ActionFinding> createActionFinding(@Valid @RequestBody ActionFinding actionFinding) throws URISyntaxException {
        log.debug("REST request to save ActionFinding : {}", actionFinding);
        if (actionFinding.getId() != null) {
            throw new BadRequestAlertException("A new actionFinding cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActionFinding result = actionFindingRepository.save(actionFinding);
        actionFindingSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/action-findings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /action-findings} : Updates an existing actionFinding.
     *
     * @param actionFinding the actionFinding to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionFinding,
     * or with status {@code 400 (Bad Request)} if the actionFinding is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actionFinding couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/action-findings")
    public ResponseEntity<ActionFinding> updateActionFinding(@Valid @RequestBody ActionFinding actionFinding) throws URISyntaxException {
        log.debug("REST request to update ActionFinding : {}", actionFinding);
        if (actionFinding.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ActionFinding result = actionFindingRepository.save(actionFinding);
        actionFindingSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actionFinding.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /action-findings} : get all the actionFindings.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actionFindings in body.
     */
    @GetMapping("/action-findings")
    public ResponseEntity<List<ActionFinding>> getAllActionFindings(Pageable pageable) {
        log.debug("REST request to get a page of ActionFindings");
        Page<ActionFinding> page = actionFindingRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /action-findings/:all} : get all the actionFindings.
     *

     * @param pageable the pagination information.
     * @param all
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actionFindings in body.
     */
    @GetMapping("/action-findings/load={all}")
    public ResponseEntity<List<ActionFinding>> getAllActionFindingsReal(@PathVariable String all) {
        log.debug("REST request to get all ActionFindings");
        Pageable pageable = Pageable.unpaged();
        Page<ActionFinding> page = actionFindingRepository.findAll(pageable);
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
    @GetMapping("/action-findings/actId={id}")
    public ResponseEntity<List<ActionFinding>> getAllActionFindingsReal(@PathVariable long id) {
        log.debug("REST request to get all ActionFindings");
        Pageable pageable = Pageable.unpaged();
        Page<ActionFinding> page = actionFindingRepository.findByActFinding_Id(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /action-findings/:id} : get the "id" actionFinding.
     *
     * @param id the id of the actionFinding to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actionFinding, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/action-findings/{id}")
    public ResponseEntity<ActionFinding> getActionFinding(@PathVariable Long id) {
        log.debug("REST request to get ActionFinding : {}", id);
        Optional<ActionFinding> actionFinding = actionFindingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actionFinding);
    }

    /**
     * {@code DELETE  /action-findings/:id} : delete the "id" actionFinding.
     *
     * @param id the id of the actionFinding to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/action-findings/{id}")
    public ResponseEntity<Void> deleteActionFinding(@PathVariable Long id) {
        log.debug("REST request to delete ActionFinding : {}", id);
        actionFindingRepository.deleteById(id);
        actionFindingSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/action-findings?query=:query} : search for the actionFinding corresponding
     * to the query.
     *
     * @param query the query of the actionFinding search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/action-findings")
    public ResponseEntity<List<ActionFinding>> searchActionFindings(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ActionFindings for query {}", query);
        Page<ActionFinding> page = actionFindingSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
