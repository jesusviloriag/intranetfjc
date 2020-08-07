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
 * A Finding.
 */
@Entity
@Table(name = "finding")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "finding")
public class Finding implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Column(name = "cod_finding", nullable = false)
    private String codFinding;

    @Column(name = "date_start")
    private LocalDate dateStart;

    @Column(name = "date_end")
    private LocalDate dateEnd;

    @Column(name = "date_closure")
    private LocalDate dateClosure;

    @Size(max = 2048)
    @Column(name = "description", length = 2048)
    private String description;

    @Size(max = 2048)
    @Column(name = "evidence", length = 2048)
    private String evidence;

    @Column(name = "methodology")
    private String methodology;

    @Lob
    @Column(name = "link_doc")
    private byte[] linkDoc;

    @Column(name = "link_doc_content_type")
    private String linkDocContentType;

    @Size(max = 2048)
    @Column(name = "desc_how", length = 2048)
    private String descHow;

    @Column(name = "type_finding")
    private Integer typeFinding;

    @Column(name = "dept_invol")
    private Integer deptInvol;

    @Size(max = 2048)
    @Column(name = "identification_cause", length = 2048)
    private String identificationCause;

    @Size(max = 2048)
    @Column(name = "corrective_act", length = 2048)
    private String correctiveAct;

    @Size(max = 2048)
    @Column(name = "action_desc", length = 2048)
    private String actionDesc;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("findings")
    private User creator;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodFinding() {
        return codFinding;
    }

    public Finding codFinding(String codFinding) {
        this.codFinding = codFinding;
        return this;
    }

    public void setCodFinding(String codFinding) {
        this.codFinding = codFinding;
    }

    public LocalDate getDateStart() {
        return dateStart;
    }

    public Finding dateStart(LocalDate dateStart) {
        this.dateStart = dateStart;
        return this;
    }

    public void setDateStart(LocalDate dateStart) {
        this.dateStart = dateStart;
    }

    public LocalDate getDateEnd() {
        return dateEnd;
    }

    public Finding dateEnd(LocalDate dateEnd) {
        this.dateEnd = dateEnd;
        return this;
    }

    public void setDateEnd(LocalDate dateEnd) {
        this.dateEnd = dateEnd;
    }

    public LocalDate getDateClosure() {
        return dateClosure;
    }

    public Finding dateClosure(LocalDate dateClosure) {
        this.dateClosure = dateClosure;
        return this;
    }

    public void setDateClosure(LocalDate dateClosure) {
        this.dateClosure = dateClosure;
    }

    public String getDescription() {
        return description;
    }

    public Finding description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEvidence() {
        return evidence;
    }

    public Finding evidence(String evidence) {
        this.evidence = evidence;
        return this;
    }

    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }

    public String getMethodology() {
        return methodology;
    }

    public Finding methodology(String methodology) {
        this.methodology = methodology;
        return this;
    }

    public void setMethodology(String methodology) {
        this.methodology = methodology;
    }

    public byte[] getLinkDoc() {
        return linkDoc;
    }

    public Finding linkDoc(byte[] linkDoc) {
        this.linkDoc = linkDoc;
        return this;
    }

    public void setLinkDoc(byte[] linkDoc) {
        this.linkDoc = linkDoc;
    }

    public String getLinkDocContentType() {
        return linkDocContentType;
    }

    public Finding linkDocContentType(String linkDocContentType) {
        this.linkDocContentType = linkDocContentType;
        return this;
    }

    public void setLinkDocContentType(String linkDocContentType) {
        this.linkDocContentType = linkDocContentType;
    }

    public String getDescHow() {
        return descHow;
    }

    public Finding descHow(String descHow) {
        this.descHow = descHow;
        return this;
    }

    public void setDescHow(String descHow) {
        this.descHow = descHow;
    }

    public Integer getTypeFinding() {
        return typeFinding;
    }

    public Finding typeFinding(Integer typeFinding) {
        this.typeFinding = typeFinding;
        return this;
    }

    public void setTypeFinding(Integer typeFinding) {
        this.typeFinding = typeFinding;
    }

    public Integer getDeptInvol() {
        return deptInvol;
    }

    public Finding deptInvol(Integer deptInvol) {
        this.deptInvol = deptInvol;
        return this;
    }

    public void setDeptInvol(Integer deptInvol) {
        this.deptInvol = deptInvol;
    }

    public String getIdentificationCause() {
        return identificationCause;
    }

    public Finding identificationCause(String identificationCause) {
        this.identificationCause = identificationCause;
        return this;
    }

    public void setIdentificationCause(String identificationCause) {
        this.identificationCause = identificationCause;
    }

    public String getCorrectiveAct() {
        return correctiveAct;
    }

    public Finding correctiveAct(String correctiveAct) {
        this.correctiveAct = correctiveAct;
        return this;
    }

    public void setCorrectiveAct(String correctiveAct) {
        this.correctiveAct = correctiveAct;
    }

    public String getActionDesc() {
        return actionDesc;
    }

    public Finding actionDesc(String actionDesc) {
        this.actionDesc = actionDesc;
        return this;
    }

    public void setActionDesc(String actionDesc) {
        this.actionDesc = actionDesc;
    }

    public User getCreator() {
        return creator;
    }

    public Finding creator(User user) {
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
        if (!(o instanceof Finding)) {
            return false;
        }
        return id != null && id.equals(((Finding) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Finding{" +
            "id=" + getId() +
            ", codFinding='" + getCodFinding() + "'" +
            ", dateStart='" + getDateStart() + "'" +
            ", dateEnd='" + getDateEnd() + "'" +
            ", dateClosure='" + getDateClosure() + "'" +
            ", description='" + getDescription() + "'" +
            ", evidence='" + getEvidence() + "'" +
            ", methodology='" + getMethodology() + "'" +
            ", linkDoc='" + getLinkDoc() + "'" +
            ", linkDocContentType='" + getLinkDocContentType() + "'" +
            ", descHow='" + getDescHow() + "'" +
            ", typeFinding=" + getTypeFinding() +
            ", deptInvol=" + getDeptInvol() +
            ", identificationCause='" + getIdentificationCause() + "'" +
            ", correctiveAct='" + getCorrectiveAct() + "'" +
            ", actionDesc='" + getActionDesc() + "'" +
            "}";
    }
}
