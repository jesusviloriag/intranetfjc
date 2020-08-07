package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.domain.Departament;
import com.jacintoconvit.intranet.repository.DepartamentRepository;
import com.jacintoconvit.intranet.repository.search.DepartamentSearchRepository;
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

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.Departament}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DepartamentResource {

    private final Logger log = LoggerFactory.getLogger(DepartamentResource.class);

    private static final String ENTITY_NAME = "departament";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DepartamentRepository departamentRepository;

    private final DepartamentSearchRepository departamentSearchRepository;

    public DepartamentResource(DepartamentRepository departamentRepository, DepartamentSearchRepository departamentSearchRepository) {
        this.departamentRepository = departamentRepository;
        this.departamentSearchRepository = departamentSearchRepository;
    }

    /**
     * {@code POST  /departaments} : Create a new departament.
     *
     * @param departament the departament to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new departament, or with status {@code 400 (Bad Request)} if the departament has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/departaments")
    public ResponseEntity<Departament> createDepartament(@RequestBody Departament departament) throws URISyntaxException {
        log.debug("REST request to save Departament : {}", departament);
        if (departament.getId() != null) {
            throw new BadRequestAlertException("A new departament cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Departament result = departamentRepository.save(departament);
        departamentSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/departaments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /departaments} : Updates an existing departament.
     *
     * @param departament the departament to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated departament,
     * or with status {@code 400 (Bad Request)} if the departament is not valid,
     * or with status {@code 500 (Internal Server Error)} if the departament couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/departaments")
    public ResponseEntity<Departament> updateDepartament(@RequestBody Departament departament) throws URISyntaxException {
        log.debug("REST request to update Departament : {}", departament);
        if (departament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Departament result = departamentRepository.save(departament);
        departamentSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, departament.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /departaments} : get all the departaments.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of departaments in body.
     */
    @GetMapping("/departaments")
    public ResponseEntity<List<Departament>> getAllDepartaments(Pageable pageable) {
        log.debug("REST request to get a page of Departaments");
        Page<Departament> page = departamentRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /departaments/load={all}} : get all the findings.
     *

     * @param pageable the pagination information.
     * @param all
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of findings in body.
     */
    @GetMapping("/departaments/load={all}")
    public ResponseEntity<List<Departament>> getAllDepartamentsJAJAJA(@PathVariable String all) {
        log.debug("REST request to get a all Findings");
        Pageable pageable = Pageable.unpaged();
        Page<Departament> page = departamentRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /departaments/:id} : get the "id" departament.
     *
     * @param id the id of the departament to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the departament, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/departaments/{id}")
    public ResponseEntity<Departament> getDepartament(@PathVariable Long id) {
        log.debug("REST request to get Departament : {}", id);
        Optional<Departament> departament = departamentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(departament);
    }

    /**
     * {@code DELETE  /departaments/:id} : delete the "id" departament.
     *
     * @param id the id of the departament to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/departaments/{id}")
    public ResponseEntity<Void> deleteDepartament(@PathVariable Long id) {
        log.debug("REST request to delete Departament : {}", id);
        departamentRepository.deleteById(id);
        departamentSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/departaments?query=:query} : search for the departament corresponding
     * to the query.
     *
     * @param query the query of the departament search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/departaments")
    public ResponseEntity<List<Departament>> searchDepartaments(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Departaments for query {}", query);
        Page<Departament> page = departamentSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
