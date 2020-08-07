package com.jacintoconvit.intranet.web.rest;

import com.jacintoconvit.intranet.FjcintranetApp;
import com.jacintoconvit.intranet.domain.Activity;
import com.jacintoconvit.intranet.domain.User;
import com.jacintoconvit.intranet.repository.ActivityRepository;
import com.jacintoconvit.intranet.repository.search.ActivitySearchRepository;
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
 * Integration tests for the {@link ActivityResource} REST controller.
 */
@SpringBootTest(classes = FjcintranetApp.class)
public class ActivityResourceIT {

    private static final String DEFAULT_NAME_ACTIVITY = "AAAAAAAAAA";
    private static final String UPDATED_NAME_ACTIVITY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_LIMIT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_LIMIT = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_DELIVERABLES = "AAAAAAAAAA";
    private static final String UPDATED_DELIVERABLES = "BBBBBBBBBB";

    private static final String DEFAULT_DEPT = "AAAAAAAAAA";
    private static final String UPDATED_DEPT = "BBBBBBBBBB";

    private static final String DEFAULT_INVOLVED_ACTIVITY = "AAAAAAAAAA";
    private static final String UPDATED_INVOLVED_ACTIVITY = "BBBBBBBBBB";

    private static final Integer DEFAULT_STATUS = 1;
    private static final Integer UPDATED_STATUS = 2;

    private static final LocalDate DEFAULT_DATE_CLOSURE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CLOSURE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private ActivityRepository activityRepository;

    /**
     * This repository is mocked in the com.jacintoconvit.intranet.repository.search test package.
     *
     * @see com.jacintoconvit.intranet.repository.search.ActivitySearchRepositoryMockConfiguration
     */
    @Autowired
    private ActivitySearchRepository mockActivitySearchRepository;

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

    private MockMvc restActivityMockMvc;

    private Activity activity;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ActivityResource activityResource = new ActivityResource(activityRepository, mockActivitySearchRepository);
        this.restActivityMockMvc = MockMvcBuilders.standaloneSetup(activityResource)
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
    public static Activity createEntity(EntityManager em) {
        Activity activity = new Activity()
            .nameActivity(DEFAULT_NAME_ACTIVITY)
            .dateStart(DEFAULT_DATE_START)
            .dateLimit(DEFAULT_DATE_LIMIT)
            .description(DEFAULT_DESCRIPTION)
            .deliverables(DEFAULT_DELIVERABLES)
            .dept(DEFAULT_DEPT)
            .involvedActivity(DEFAULT_INVOLVED_ACTIVITY)
            .status(DEFAULT_STATUS)
            .dateClosure(DEFAULT_DATE_CLOSURE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        activity.setCreator(user);
        return activity;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Activity createUpdatedEntity(EntityManager em) {
        Activity activity = new Activity()
            .nameActivity(UPDATED_NAME_ACTIVITY)
            .dateStart(UPDATED_DATE_START)
            .dateLimit(UPDATED_DATE_LIMIT)
            .description(UPDATED_DESCRIPTION)
            .deliverables(UPDATED_DELIVERABLES)
            .dept(UPDATED_DEPT)
            .involvedActivity(UPDATED_INVOLVED_ACTIVITY)
            .status(UPDATED_STATUS)
            .dateClosure(UPDATED_DATE_CLOSURE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        activity.setCreator(user);
        return activity;
    }

    @BeforeEach
    public void initTest() {
        activity = createEntity(em);
    }

    @Test
    @Transactional
    public void createActivity() throws Exception {
        int databaseSizeBeforeCreate = activityRepository.findAll().size();

        // Create the Activity
        restActivityMockMvc.perform(post("/api/activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activity)))
            .andExpect(status().isCreated());

        // Validate the Activity in the database
        List<Activity> activityList = activityRepository.findAll();
        assertThat(activityList).hasSize(databaseSizeBeforeCreate + 1);
        Activity testActivity = activityList.get(activityList.size() - 1);
        assertThat(testActivity.getNameActivity()).isEqualTo(DEFAULT_NAME_ACTIVITY);
        assertThat(testActivity.getDateStart()).isEqualTo(DEFAULT_DATE_START);
        assertThat(testActivity.getDateLimit()).isEqualTo(DEFAULT_DATE_LIMIT);
        assertThat(testActivity.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testActivity.getDeliverables()).isEqualTo(DEFAULT_DELIVERABLES);
        assertThat(testActivity.getDept()).isEqualTo(DEFAULT_DEPT);
        assertThat(testActivity.getInvolvedActivity()).isEqualTo(DEFAULT_INVOLVED_ACTIVITY);
        assertThat(testActivity.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testActivity.getDateClosure()).isEqualTo(DEFAULT_DATE_CLOSURE);

        // Validate the Activity in Elasticsearch
        verify(mockActivitySearchRepository, times(1)).save(testActivity);
    }

    @Test
    @Transactional
    public void createActivityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = activityRepository.findAll().size();

        // Create the Activity with an existing ID
        activity.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivityMockMvc.perform(post("/api/activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activity)))
            .andExpect(status().isBadRequest());

        // Validate the Activity in the database
        List<Activity> activityList = activityRepository.findAll();
        assertThat(activityList).hasSize(databaseSizeBeforeCreate);

        // Validate the Activity in Elasticsearch
        verify(mockActivitySearchRepository, times(0)).save(activity);
    }


    @Test
    @Transactional
    public void getAllActivities() throws Exception {
        // Initialize the database
        activityRepository.saveAndFlush(activity);

        // Get all the activityList
        restActivityMockMvc.perform(get("/api/activities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activity.getId().intValue())))
            .andExpect(jsonPath("$.[*].nameActivity").value(hasItem(DEFAULT_NAME_ACTIVITY)))
            .andExpect(jsonPath("$.[*].dateStart").value(hasItem(DEFAULT_DATE_START.toString())))
            .andExpect(jsonPath("$.[*].dateLimit").value(hasItem(DEFAULT_DATE_LIMIT.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].deliverables").value(hasItem(DEFAULT_DELIVERABLES)))
            .andExpect(jsonPath("$.[*].dept").value(hasItem(DEFAULT_DEPT)))
            .andExpect(jsonPath("$.[*].involvedActivity").value(hasItem(DEFAULT_INVOLVED_ACTIVITY)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].dateClosure").value(hasItem(DEFAULT_DATE_CLOSURE.toString())));
    }
    
    @Test
    @Transactional
    public void getActivity() throws Exception {
        // Initialize the database
        activityRepository.saveAndFlush(activity);

        // Get the activity
        restActivityMockMvc.perform(get("/api/activities/{id}", activity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(activity.getId().intValue()))
            .andExpect(jsonPath("$.nameActivity").value(DEFAULT_NAME_ACTIVITY))
            .andExpect(jsonPath("$.dateStart").value(DEFAULT_DATE_START.toString()))
            .andExpect(jsonPath("$.dateLimit").value(DEFAULT_DATE_LIMIT.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.deliverables").value(DEFAULT_DELIVERABLES))
            .andExpect(jsonPath("$.dept").value(DEFAULT_DEPT))
            .andExpect(jsonPath("$.involvedActivity").value(DEFAULT_INVOLVED_ACTIVITY))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.dateClosure").value(DEFAULT_DATE_CLOSURE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingActivity() throws Exception {
        // Get the activity
        restActivityMockMvc.perform(get("/api/activities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateActivity() throws Exception {
        // Initialize the database
        activityRepository.saveAndFlush(activity);

        int databaseSizeBeforeUpdate = activityRepository.findAll().size();

        // Update the activity
        Activity updatedActivity = activityRepository.findById(activity.getId()).get();
        // Disconnect from session so that the updates on updatedActivity are not directly saved in db
        em.detach(updatedActivity);
        updatedActivity
            .nameActivity(UPDATED_NAME_ACTIVITY)
            .dateStart(UPDATED_DATE_START)
            .dateLimit(UPDATED_DATE_LIMIT)
            .description(UPDATED_DESCRIPTION)
            .deliverables(UPDATED_DELIVERABLES)
            .dept(UPDATED_DEPT)
            .involvedActivity(UPDATED_INVOLVED_ACTIVITY)
            .status(UPDATED_STATUS)
            .dateClosure(UPDATED_DATE_CLOSURE);

        restActivityMockMvc.perform(put("/api/activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedActivity)))
            .andExpect(status().isOk());

        // Validate the Activity in the database
        List<Activity> activityList = activityRepository.findAll();
        assertThat(activityList).hasSize(databaseSizeBeforeUpdate);
        Activity testActivity = activityList.get(activityList.size() - 1);
        assertThat(testActivity.getNameActivity()).isEqualTo(UPDATED_NAME_ACTIVITY);
        assertThat(testActivity.getDateStart()).isEqualTo(UPDATED_DATE_START);
        assertThat(testActivity.getDateLimit()).isEqualTo(UPDATED_DATE_LIMIT);
        assertThat(testActivity.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testActivity.getDeliverables()).isEqualTo(UPDATED_DELIVERABLES);
        assertThat(testActivity.getDept()).isEqualTo(UPDATED_DEPT);
        assertThat(testActivity.getInvolvedActivity()).isEqualTo(UPDATED_INVOLVED_ACTIVITY);
        assertThat(testActivity.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testActivity.getDateClosure()).isEqualTo(UPDATED_DATE_CLOSURE);

        // Validate the Activity in Elasticsearch
        verify(mockActivitySearchRepository, times(1)).save(testActivity);
    }

    @Test
    @Transactional
    public void updateNonExistingActivity() throws Exception {
        int databaseSizeBeforeUpdate = activityRepository.findAll().size();

        // Create the Activity

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityMockMvc.perform(put("/api/activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activity)))
            .andExpect(status().isBadRequest());

        // Validate the Activity in the database
        List<Activity> activityList = activityRepository.findAll();
        assertThat(activityList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Activity in Elasticsearch
        verify(mockActivitySearchRepository, times(0)).save(activity);
    }

    @Test
    @Transactional
    public void deleteActivity() throws Exception {
        // Initialize the database
        activityRepository.saveAndFlush(activity);

        int databaseSizeBeforeDelete = activityRepository.findAll().size();

        // Delete the activity
        restActivityMockMvc.perform(delete("/api/activities/{id}", activity.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Activity> activityList = activityRepository.findAll();
        assertThat(activityList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Activity in Elasticsearch
        verify(mockActivitySearchRepository, times(1)).deleteById(activity.getId());
    }

    @Test
    @Transactional
    public void searchActivity() throws Exception {
        // Initialize the database
        activityRepository.saveAndFlush(activity);
        when(mockActivitySearchRepository.search(queryStringQuery("id:" + activity.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(activity), PageRequest.of(0, 1), 1));
        // Search the activity
        restActivityMockMvc.perform(get("/api/_search/activities?query=id:" + activity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activity.getId().intValue())))
            .andExpect(jsonPath("$.[*].nameActivity").value(hasItem(DEFAULT_NAME_ACTIVITY)))
            .andExpect(jsonPath("$.[*].dateStart").value(hasItem(DEFAULT_DATE_START.toString())))
            .andExpect(jsonPath("$.[*].dateLimit").value(hasItem(DEFAULT_DATE_LIMIT.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].deliverables").value(hasItem(DEFAULT_DELIVERABLES)))
            .andExpect(jsonPath("$.[*].dept").value(hasItem(DEFAULT_DEPT)))
            .andExpect(jsonPath("$.[*].involvedActivity").value(hasItem(DEFAULT_INVOLVED_ACTIVITY)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].dateClosure").value(hasItem(DEFAULT_DATE_CLOSURE.toString())));
    }
}
