package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.domain.UserInDepartment;
import com.jacintoconvit.intranet.repository.UserInDepartmentRepository;
import com.jacintoconvit.intranet.repository.search.UserInDepartmentSearchRepository;
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
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.UserInDepartment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserInDepartmentResource {

    private final Logger log = LoggerFactory.getLogger(UserInDepartmentResource.class);

    private static final String ENTITY_NAME = "userInDepartment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserInDepartmentRepository userInDepartmentRepository;

    private final UserInDepartmentSearchRepository userInDepartmentSearchRepository;

    public UserInDepartmentResource(UserInDepartmentRepository userInDepartmentRepository, UserInDepartmentSearchRepository userInDepartmentSearchRepository) {
        this.userInDepartmentRepository = userInDepartmentRepository;
        this.userInDepartmentSearchRepository = userInDepartmentSearchRepository;
    }

    /**
     * {@code POST  /user-in-departments} : Create a new userInDepartment.
     *
     * @param userInDepartment the userInDepartment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userInDepartment, or with status {@code 400 (Bad Request)} if the userInDepartment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-in-departments")
    public ResponseEntity<UserInDepartment> createUserInDepartment(@Valid @RequestBody UserInDepartment userInDepartment) throws URISyntaxException {
        log.debug("REST request to save UserInDepartment : {}", userInDepartment);
        if (userInDepartment.getId() != null) {
            throw new BadRequestAlertException("A new userInDepartment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserInDepartment result = userInDepartmentRepository.save(userInDepartment);
        userInDepartmentSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/user-in-departments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-in-departments} : Updates an existing userInDepartment.
     *
     * @param userInDepartment the userInDepartment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userInDepartment,
     * or with status {@code 400 (Bad Request)} if the userInDepartment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userInDepartment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-in-departments")
    public ResponseEntity<UserInDepartment> updateUserInDepartment(@Valid @RequestBody UserInDepartment userInDepartment) throws URISyntaxException {
        log.debug("REST request to update UserInDepartment : {}", userInDepartment);
        if (userInDepartment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserInDepartment result = userInDepartmentRepository.save(userInDepartment);
        userInDepartmentSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userInDepartment.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /user-in-departments} : get all the userInDepartments.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userInDepartments in body.
     */
    @GetMapping("/user-in-departments")
    public ResponseEntity<List<UserInDepartment>> getAllUserInDepartments(Pageable pageable) {
        log.debug("REST request to get a page of UserInDepartments");
        Page<UserInDepartment> page = userInDepartmentRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-Departaments/findActual} : get the departament by Actual user
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of departaments in body.
     */
    @GetMapping("/user-in-departments/findActual")
    public ResponseEntity<List<UserInDepartment>> getDeptByActualUser() {
        log.debug("BUSQUEDA DE DEPARTAMENTO");
        List<UserInDepartment> result = userInDepartmentRepository.findByUserIsCurrentUser();
        return ResponseEntity.ok().body(result);
    }


    /**
     * {@code GET  /user-in-departments/:id} : get the "id" userInDepartment.
     *
     * @param id the id of the userInDepartment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userInDepartment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-in-departments/{id}")
    public ResponseEntity<UserInDepartment> getUserInDepartment(@PathVariable Long id) {
        log.debug("REST request to get UserInDepartment : {}", id);
        Optional<UserInDepartment> userInDepartment = userInDepartmentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userInDepartment);
    }

    /**
     * {@code DELETE  /user-in-departments/:id} : delete the "id" userInDepartment.
     *
     * @param id the id of the userInDepartment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-in-departments/{id}")
    public ResponseEntity<Void> deleteUserInDepartment(@PathVariable Long id) {
        log.debug("REST request to delete UserInDepartment : {}", id);
        userInDepartmentRepository.deleteById(id);
        userInDepartmentSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/user-in-departments?query=:query} : search for the userInDepartment corresponding
     * to the query.
     *
     * @param query the query of the userInDepartment search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/user-in-departments")
    public ResponseEntity<List<UserInDepartment>> searchUserInDepartments(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of UserInDepartments for query {}", query);
        Page<UserInDepartment> page = userInDepartmentSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
