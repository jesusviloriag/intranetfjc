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
 * A ActionFinding.
 */
@Entity
@Table(name = "action_finding")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "actionfinding")
public class ActionFinding implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Size(max = 2048)
    @Column(name = "desc_action", length = 2048)
    private String descAction;

    @Column(name = "date_start_action")
    private LocalDate dateStartAction;

    @Column(name = "date_commit")
    private LocalDate dateCommit;

    @Column(name = "date_real_commit")
    private LocalDate dateRealCommit;

    @Size(max = 2048)
    @Column(name = "desc_how", length = 2048)
    private String descHow;

    @Column(name = "involved")
    private String involved;

    @Column(name = "status")
    private Integer status;

    @Lob
    @Column(name = "evidence_doc")
    private byte[] evidenceDoc;

    @Column(name = "evidence_doc_content_type")
    private String evidenceDocContentType;

    @Size(max = 2048)
    @Column(name = "observation", length = 2048)
    private String observation;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("actionFindings")
    private Finding actFinding;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescAction() {
        return descAction;
    }

    public ActionFinding descAction(String descAction) {
        this.descAction = descAction;
        return this;
    }

    public void setDescAction(String descAction) {
        this.descAction = descAction;
    }

    public LocalDate getDateStartAction() {
        return dateStartAction;
    }

    public ActionFinding dateStartAction(LocalDate dateStartAction) {
        this.dateStartAction = dateStartAction;
        return this;
    }

    public void setDateStartAction(LocalDate dateStartAction) {
        this.dateStartAction = dateStartAction;
    }

    public LocalDate getDateCommit() {
        return dateCommit;
    }

    public ActionFinding dateCommit(LocalDate dateCommit) {
        this.dateCommit = dateCommit;
        return this;
    }

    public void setDateCommit(LocalDate dateCommit) {
        this.dateCommit = dateCommit;
    }

    public LocalDate getDateRealCommit() {
        return dateRealCommit;
    }

    public ActionFinding dateRealCommit(LocalDate dateRealCommit) {
        this.dateRealCommit = dateRealCommit;
        return this;
    }

    public void setDateRealCommit(LocalDate dateRealCommit) {
        this.dateRealCommit = dateRealCommit;
    }

    public String getDescHow() {
        return descHow;
    }

    public ActionFinding descHow(String descHow) {
        this.descHow = descHow;
        return this;
    }

    public void setDescHow(String descHow) {
        this.descHow = descHow;
    }

    public String getInvolved() {
        return involved;
    }

    public ActionFinding involved(String involved) {
        this.involved = involved;
        return this;
    }

    public void setInvolved(String involved) {
        this.involved = involved;
    }

    public Integer getStatus() {
        return status;
    }

    public ActionFinding status(Integer status) {
        this.status = status;
        return this;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public byte[] getEvidenceDoc() {
        return evidenceDoc;
    }

    public ActionFinding evidenceDoc(byte[] evidenceDoc) {
        this.evidenceDoc = evidenceDoc;
        return this;
    }

    public void setEvidenceDoc(byte[] evidenceDoc) {
        this.evidenceDoc = evidenceDoc;
    }

    public String getEvidenceDocContentType() {
        return evidenceDocContentType;
    }

    public ActionFinding evidenceDocContentType(String evidenceDocContentType) {
        this.evidenceDocContentType = evidenceDocContentType;
        return this;
    }

    public void setEvidenceDocContentType(String evidenceDocContentType) {
        this.evidenceDocContentType = evidenceDocContentType;
    }

    public String getObservation() {
        return observation;
    }

    public ActionFinding observation(String observation) {
        this.observation = observation;
        return this;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public Finding getActFinding() {
        return actFinding;
    }

    public ActionFinding actFinding(Finding finding) {
        this.actFinding = finding;
        return this;
    }

    public void setActFinding(Finding finding) {
        this.actFinding = finding;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActionFinding)) {
            return false;
        }
        return id != null && id.equals(((ActionFinding) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ActionFinding{" +
            "id=" + getId() +
            ", descAction='" + getDescAction() + "'" +
            ", dateStartAction='" + getDateStartAction() + "'" +
            ", dateCommit='" + getDateCommit() + "'" +
            ", dateRealCommit='" + getDateRealCommit() + "'" +
            ", descHow='" + getDescHow() + "'" +
            ", involved='" + getInvolved() + "'" +
            ", status=" + getStatus() +
            ", evidenceDoc='" + getEvidenceDoc() + "'" +
            ", evidenceDocContentType='" + getEvidenceDocContentType() + "'" +
            ", observation='" + getObservation() + "'" +
            "}";
    }
}
