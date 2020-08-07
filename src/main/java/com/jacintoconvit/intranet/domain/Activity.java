package com.jacintoconvit.intranet.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Activity.
 */
@Entity
@Table(name = "activity")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "activity")
public class Activity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "name_activity")
    private String nameActivity;

    @Column(name = "date_start")
    private LocalDate dateStart;

    @Column(name = "date_limit")
    private LocalDate dateLimit;

    @Size(max = 2048)
    @Column(name = "description", length = 2048)
    private String description;

    @Size(max = 2048)
    @Column(name = "deliverables", length = 2048)
    private String deliverables;

    @Column(name = "dept")
    private String dept;

    @Column(name = "involved_activity")
    private String involvedActivity;

    @Column(name = "status")
    private Integer status;

    @Column(name = "date_closure")
    private LocalDate dateClosure;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("activities")
    private User creator;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameActivity() {
        return nameActivity;
    }

    public Activity nameActivity(String nameActivity) {
        this.nameActivity = nameActivity;
        return this;
    }

    public void setNameActivity(String nameActivity) {
        this.nameActivity = nameActivity;
    }

    public LocalDate getDateStart() {
        return dateStart;
    }

    public Activity dateStart(LocalDate dateStart) {
        this.dateStart = dateStart;
        return this;
    }

    public void setDateStart(LocalDate dateStart) {
        this.dateStart = dateStart;
    }

    public LocalDate getDateLimit() {
        return dateLimit;
    }

    public Activity dateLimit(LocalDate dateLimit) {
        this.dateLimit = dateLimit;
        return this;
    }

    public void setDateLimit(LocalDate dateLimit) {
        this.dateLimit = dateLimit;
    }

    public String getDescription() {
        return description;
    }

    public Activity description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeliverables() {
        return deliverables;
    }

    public Activity deliverables(String deliverables) {
        this.deliverables = deliverables;
        return this;
    }

    public void setDeliverables(String deliverables) {
        this.deliverables = deliverables;
    }

    public String getDept() {
        return dept;
    }

    public Activity dept(String dept) {
        this.dept = dept;
        return this;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getInvolvedActivity() {
        return involvedActivity;
    }

    public Activity involvedActivity(String involvedActivity) {
        this.involvedActivity = involvedActivity;
        return this;
    }

    public void setInvolvedActivity(String involvedActivity) {
        this.involvedActivity = involvedActivity;
    }

    public Integer getStatus() {
        return status;
    }

    public Activity status(Integer status) {
        this.status = status;
        return this;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDate getDateClosure() {
        return dateClosure;
    }

    public Activity dateClosure(LocalDate dateClosure) {
        this.dateClosure = dateClosure;
        return this;
    }

    public void setDateClosure(LocalDate dateClosure) {
        this.dateClosure = dateClosure;
    }

    public User getCreator() {
        return creator;
    }

    public Activity creator(User user) {
        this.creator = user;
        return this;
    }

    public void setCreator(User user) {
        this.creator = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Activity)) {
            return false;
        }
        return id != null && id.equals(((Activity) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Activity{" +
            "id=" + getId() +
            ", nameActivity='" + getNameActivity() + "'" +
            ", dateStart='" + getDateStart() + "'" +
            ", dateLimit='" + getDateLimit() + "'" +
            ", description='" + getDescription() + "'" +
            ", deliverables='" + getDeliverables() + "'" +
            ", dept='" + getDept() + "'" +
            ", involvedActivity='" + getInvolvedActivity() + "'" +
            ", status=" + getStatus() +
            ", dateClosure='" + getDateClosure() + "'" +
            "}";
    }
}
