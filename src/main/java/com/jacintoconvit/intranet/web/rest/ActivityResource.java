package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.domain.Activity;
import com.jacintoconvit.intranet.repository.ActivityRepository;
import com.jacintoconvit.intranet.repository.search.ActivitySearchRepository;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.time.LocalDate;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.Activity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivityResource {

    private final Logger log = LoggerFactory.getLogger(ActivityResource.class);

    private static final String ENTITY_NAME = "activity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivityRepository activityRepository;

    private final ActivitySearchRepository activitySearchRepository;

    public ActivityResource(ActivityRepository activityRepository, ActivitySearchRepository activitySearchRepository) {
        this.activityRepository = activityRepository;
        this.activitySearchRepository = activitySearchRepository;
    }

    /**
     * {@code POST  /activities} : Create a new activity.
     *
     * @param activity the activity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activity, or with status {@code 400 (Bad Request)} if the activity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activities")
    public ResponseEntity<Activity> createActivity(@Valid @RequestBody Activity activity) throws URISyntaxException {
        log.debug("REST request to save Activity : {}", activity);
        if (activity.getId() != null) {
            throw new BadRequestAlertException("A new activity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Activity result = activityRepository.save(activity);
        activitySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/activities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activities} : Updates an existing activity.
     *
     * @param activity the activity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activity,
     * or with status {@code 400 (Bad Request)} if the activity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activities")
    public ResponseEntity<Activity> updateActivity(@Valid @RequestBody Activity activity) throws URISyntaxException {
        log.debug("REST request to update Activity : {}", activity);
        if (activity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Activity result = activityRepository.save(activity);
        activitySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, activity.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /activities} : get all the activities.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activities in body.
     */
    @GetMapping("/activities")
    public ResponseEntity<List<Activity>> getAllActivities(Pageable pageable) {
        log.debug("REST request to get a page of Activities");
        Page<Activity> page = activityRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /activities} : get all the activities.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activities in body.
     */
    @GetMapping("/activities/all")
    public ResponseEntity<List<Activity>> getAllActivitiesWithoutPage() {
        log.debug("REST request to get all Activities");
        Pageable pageable = Pageable.unpaged();
        Page<Activity> page = activityRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /activities} : get all the activities.
     *

     * @param pageable the pagination information.
     * @param startDate
     * @param limitDate
     * @param status
     * @param order
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activities in body.
     */
    @GetMapping("/activities/query/{startDate}&{limitDate}&{status}&{order}")
    public ResponseEntity<List<Activity>> getActivitiesFilter(@PathVariable String startDate,@PathVariable String limitDate, @PathVariable String status, @PathVariable String order, Pageable pageable) {
      String[] items = order.split("-");
      String orderItem = items[0];
      String direction = items[1];
      int currentPage = Integer.parseInt(items[2]);
      int realStatus = Integer.parseInt(status);
      log.debug("REST request to get a page of ACTIVIDADDDDDDDDDDDDDDDDDDDDDDDDDD {} {} {}",orderItem, direction, currentPage);

      if((direction).equals("DESC")){
        pageable = PageRequest.of(currentPage, 20, Sort.by(orderItem).descending());
      }else{
        pageable = PageRequest.of(currentPage, 20, Sort.by(orderItem).ascending());
      }

      Page page = null;
      if(!(startDate).equals("") || !(limitDate).equals("") || realStatus != 0){

        if((startDate).equals("") && (limitDate).equals("") && realStatus != 0){
          page = activityRepository.findByStatusEquals(realStatus, pageable);
        }

        if((startDate).equals("") && !(limitDate).equals("") && realStatus == 0){
          LocalDate date1 = LocalDate.parse(limitDate);
          page = activityRepository.findByDateLimitLessThanEqual(date1, pageable);
        }

        if(!(startDate).equals("") && (limitDate).equals("") && realStatus == 0){
          LocalDate date1 = LocalDate.parse(startDate);
          page = activityRepository.findByDateStartGreaterThanEqual(date1, pageable);
        }

        if(!(startDate).equals("") && (limitDate).equals("") && realStatus != 0){
          LocalDate date1 = LocalDate.parse(startDate);
          page = activityRepository.findByDateStartGreaterThanEqualAndStatusEquals(date1, realStatus, pageable);
        }

        if((startDate).equals("") && !(limitDate).equals("") && realStatus != 0){
          LocalDate date1 = LocalDate.parse(limitDate);
          page = activityRepository.findByDateLimitLessThanEqualAndStatusEquals(date1, realStatus, pageable);
        }

        if(!(startDate).equals("") && !(limitDate).equals("") && realStatus == 0){
          LocalDate date1 = LocalDate.parse(startDate);
          LocalDate date2 = LocalDate.parse(limitDate);
          page = activityRepository.findByDateStartGreaterThanEqualAndDateLimitLessThanEqual(date1, date2, pageable);
        }

        if(!(startDate).equals("") && !(limitDate).equals("") && realStatus != 0){
          LocalDate date1 = LocalDate.parse(startDate);
          LocalDate date2 = LocalDate.parse(limitDate);
          page = activityRepository.findByDateStartGreaterThanEqualAndDateLimitLessThanEqualAndStatusEquals(date1, date2, realStatus, pageable);
        }
      }else{
        page = activityRepository.findAll(pageable);
      }

      HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
      return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /activities/:id} : get the "id" activity.
     *
     * @param id the id of the activity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activities/{id}")
    public ResponseEntity<Activity> getActivity(@PathVariable Long id) {
        log.debug("REST request to get Activity : {}", id);
        Optional<Activity> activity = activityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activity);
    }

    /**
     * {@code DELETE  /activities/:id} : delete the "id" activity.
     *
     * @param id the id of the activity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activities/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        log.debug("REST request to delete Activity : {}", id);
        activityRepository.deleteById(id);
        activitySearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/activities?query=:query} : search for the activity corresponding
     * to the query.
     *
     * @param query the query of the activity search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/activities")
    public ResponseEntity<List<Activity>> searchActivities(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Activities for query {}", query);
        Page<Activity> page = activitySearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
