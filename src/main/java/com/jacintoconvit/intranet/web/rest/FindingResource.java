package com.jacintoconvit.intranet.web.rest;
import java.time.LocalDate;
import com.jacintoconvit.intranet.domain.Finding;
import com.jacintoconvit.intranet.repository.FindingRepository;
import com.jacintoconvit.intranet.repository.search.FindingSearchRepository;
import com.jacintoconvit.intranet.web.rest.errors.BadRequestAlertException;
import java.text.SimpleDateFormat;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import org.springframework.data.domain.AbstractPageRequest;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.Finding}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FindingResource {

    private final Logger log = LoggerFactory.getLogger(FindingResource.class);

    private static final String ENTITY_NAME = "finding";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FindingRepository findingRepository;

    private final FindingSearchRepository findingSearchRepository;

    public FindingResource(FindingRepository findingRepository, FindingSearchRepository findingSearchRepository) {
        this.findingRepository = findingRepository;
        this.findingSearchRepository = findingSearchRepository;
    }

    /**
     * {@code POST  /findings} : Create a new finding.
     *
     * @param finding the finding to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new finding, or with status {@code 400 (Bad Request)} if the finding has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/findings")
    public ResponseEntity<Finding> createFinding(@Valid @RequestBody Finding finding) throws URISyntaxException {
        log.debug("REST request to save Finding : {}", finding);
        if (finding.getId() != null) {
            throw new BadRequestAlertException("A new finding cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Finding result = findingRepository.save(finding);
        findingSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/findings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /findings} : Updates an existing finding.
     *
     * @param finding the finding to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated finding,
     * or with status {@code 400 (Bad Request)} if the finding is not valid,
     * or with status {@code 500 (Internal Server Error)} if the finding couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/findings")
    public ResponseEntity<Finding> updateFinding(@Valid @RequestBody Finding finding) throws URISyntaxException {
        log.debug("REST request to update Finding : {}", finding);
        if (finding.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Finding result = findingRepository.save(finding);
        findingSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, finding.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /findings} : get all the findings.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of findings in body.
     */
    @GetMapping("/findings")
    public ResponseEntity<List<Finding>> getAllFindings(Pageable pageable) {
        log.debug("REST request to get a page of Findings");
        Page<Finding> page = findingRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /findings/load={all}} : get all the findings.
     *

     * @param pageable the pagination information.
     * @param all
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of findings in body.
     */
    @GetMapping("/findings/load={all}")
    public ResponseEntity<List<Finding>> getAllFindings(@PathVariable String all) {
        log.debug("REST request to get a all Findings");
        Pageable pageable = Pageable.unpaged();
        Page<Finding> page = findingRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /findings/:id} : get the "id" finding.
     *
     * @param id the id of the finding to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the finding, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/findings/{id}")
    public ResponseEntity<Finding> getFinding(@PathVariable Long id) {
        log.debug("REST request to get Finding : {}", id);
        Optional<Finding> finding = findingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(finding);
    }

    /**
     * {@code DELETE  /findings/:id} : delete the "id" finding.
     *
     * @param id the id of the finding to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/findings/{id}")
    public ResponseEntity<Void> deleteFinding(@PathVariable Long id) {
        log.debug("REST request to delete Finding : {}", id);
        findingRepository.deleteById(id);
        findingSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/findings?query=:query} : search for the finding corresponding
     * to the query.
     *
     * @param query the query of the finding search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/findings")
    public ResponseEntity<List<Finding>> searchFindings(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Findings for query {}", query);
        Page<Finding> page = findingSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }


     /**
     * {@code GET  /finding/query/{startDate}&{limitDate}&{closureDate}&{order}/asc} : search for the finding corresponding
     * to the query.
     *
     * @param startDate
     * @param limitDate
     * @param closureDate
     * @param order
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/findings/query/{startDate}&{limitDate}&{closureDate}&{order}")
    public ResponseEntity<List<Finding>> queryFindingRecordsAsc(@PathVariable String startDate,@PathVariable String limitDate, @PathVariable String closureDate, @PathVariable String order, Pageable pageable)throws Exception {
      log.debug("REST request to search for a page of Findings in records for query {}", closureDate);
      String[] items = order.split("-");
      String orderItem = items[0];
      String direction = items[1];
      int dept = Integer.parseInt(items[3]);
      int currentPage = Integer.parseInt(items[2]);
      log.debug("REST request to get a page of Documentaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaas {} {} {}",orderItem, direction, currentPage);

      if((direction).equals("DESC")){
        pageable = PageRequest.of(currentPage, 20, Sort.by(orderItem).descending());
      }else{
        pageable = PageRequest.of(currentPage, 20, Sort.by(orderItem).ascending());
      }

      Page page = null;

      if(!(startDate).equals("") || !(limitDate).equals("") || !(closureDate).equals("null")){
        //only startdate
        if(!(startDate).equals("") && (limitDate).equals("") && (closureDate).equals("null")){
          LocalDate date1 = LocalDate.parse(startDate);
          page = findingRepository.findByDateStartGreaterThanEqualAndDeptInvolEquals(date1, dept, pageable);
        }
        //only dateEnd
        if((startDate).equals("") && !(limitDate).equals("") && (closureDate).equals("null")){
          LocalDate date1 = LocalDate.parse(limitDate);
          page = findingRepository.findByDateEndLessThanEqualAndDeptInvolEquals(date1, dept, pageable);
        }
        //only closure date
        if((closureDate).equals("false")){
          page = findingRepository.findByDateClosureIsNullAndDeptInvolEquals( dept,pageable);
        }
        //stardate y limitdate
        if(!(startDate).equals("") && !(limitDate).equals("") && (closureDate).equals("null")){
          LocalDate date1 = LocalDate.parse(startDate);
          LocalDate date2 = LocalDate.parse(limitDate);
          page = findingRepository.findByDateStartGreaterThanEqualAndDateEndLessThanEqualAndDeptInvolEquals(date1, date2, dept, pageable);
        }
        //startdate y closuredate notnull
        if(!(startDate).equals("") && (limitDate).equals("") && (closureDate).equals("true")){
          LocalDate date1 = LocalDate.parse(startDate);
          page = findingRepository.findByDateStartGreaterThanEqualAndDateClosureNotNullAndDeptInvolEquals(date1, dept, pageable);
        }
        //limitdate y closuredate notnull
        if((startDate).equals("") && !(limitDate).equals("") && (closureDate).equals("true")){
          LocalDate date1 = LocalDate.parse(limitDate);
          page = findingRepository.findByDateEndLessThanEqualAndDateClosureNotNullAndDeptInvolEquals(date1, dept, pageable);
        }
        //Stardate, limitdate y closuredate not null
        if(!(startDate).equals("") && !(limitDate).equals("") && (closureDate).equals("true") ){
          LocalDate date1 = LocalDate.parse(startDate);
          LocalDate date2 = LocalDate.parse(limitDate);
          page = findingRepository.findByDateStartGreaterThanEqualAndDateEndLessThanEqualAndDateClosureNotNullAndDeptInvolEquals(date1, date2, dept, pageable);
        }
        //Stardate, limitdate y closuredate null
        if(!(startDate).equals("") && !(limitDate).equals("") && (closureDate).equals("false") ){
          LocalDate date1 = LocalDate.parse(startDate);
          LocalDate date2 = LocalDate.parse(limitDate);
          page = findingRepository.findByDateStartGreaterThanEqualAndDateEndLessThanEqualAndDateClosureIsNullAndDeptInvolEquals(date1, date2, dept, pageable);
        }
        //Closuredate notnull
        if((startDate).equals("") && (limitDate).equals("") && (closureDate).equals("true")){
          page = findingRepository.findByDateClosureNotNullAndDeptInvolEquals( dept,pageable);
        }
        //startdate y closuredate null
        if(!(startDate).equals("") && (limitDate).equals("") && (closureDate).equals("false")){
          LocalDate date1 = LocalDate.parse(startDate);
          page = findingRepository.findByDateStartGreaterThanEqualAndDateClosureIsNullAndDeptInvolEquals(date1, dept, pageable);
        }
        //limitdate y closuredate null
        if((startDate).equals("") && !(limitDate).equals("") && (closureDate).equals("false")){
          LocalDate date1 = LocalDate.parse(limitDate);
          page = findingRepository.findByDateEndLessThanEqualAndDateClosureIsNullAndDeptInvolEquals(date1, dept, pageable);
        }
      }else{
        page = findingRepository.findByDeptInvolEquals(dept,pageable);
      }
      HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
      return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
