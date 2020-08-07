package com.jacintoconvit.intranet.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A Closures.
 */
@Entity
@Table(name = "closures")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "closures")
public class Closures implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "state_closure")
    private String stateClosure;

    @Column(name = "action_closed")
    private String actionClosed;

    @Column(name = "effectiveness")
    private Double effectiveness;

    @Column(name = "dept")
    private String dept;

    @Size(max = 2048)
    @Column(name = "improve_comment", length = 2048)
    private String improveComment;

    @Size(max = 2048)
    @Column(name = "effectiveness_comment", length = 2048)
    private String effectivenessComment;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Finding findClose;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStateClosure() {
        return stateClosure;
    }

    public Closures stateClosure(String stateClosure) {
        this.stateClosure = stateClosure;
        return this;
    }

    public void setStateClosure(String stateClosure) {
        this.stateClosure = stateClosure;
    }

    public String getActionClosed() {
        return actionClosed;
    }

    public Closures actionClosed(String actionClosed) {
        this.actionClosed = actionClosed;
        return this;
    }

    public void setActionClosed(String actionClosed) {
        this.actionClosed = actionClosed;
    }

    public Double getEffectiveness() {
        return effectiveness;
    }

    public Closures effectiveness(Double effectiveness) {
        this.effectiveness = effectiveness;
        return this;
    }

    public void setEffectiveness(Double effectiveness) {
        this.effectiveness = effectiveness;
    }

    public String getDept() {
        return dept;
    }

    public Closures dept(String dept) {
        this.dept = dept;
        return this;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getImproveComment() {
        return improveComment;
    }

    public Closures improveComment(String improveComment) {
        this.improveComment = improveComment;
        return this;
    }

    public void setImproveComment(String improveComment) {
        this.improveComment = improveComment;
    }

    public String getEffectivenessComment() {
        return effectivenessComment;
    }

    public Closures effectivenessComment(String effectivenessComment) {
        this.effectivenessComment = effectivenessComment;
        return this;
    }

    public void setEffectivenessComment(String effectivenessComment) {
        this.effectivenessComment = effectivenessComment;
    }

    public Finding getFindClose() {
        return findClose;
    }

    public Closures findClose(Finding finding) {
        this.findClose = finding;
        return this;
    }

    public void setFindClose(Finding finding) {
        this.findClose = finding;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Closures)) {
            return false;
        }
        return id != null && id.equals(((Closures) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Closures{" +
            "id=" + getId() +
            ", stateClosure='" + getStateClosure() + "'" +
            ", actionClosed='" + getActionClosed() + "'" +
            ", effectiveness=" + getEffectiveness() +
            ", dept='" + getDept() + "'" +
            ", improveComment='" + getImproveComment() + "'" +
            ", effectivenessComment='" + getEffectivenessComment() + "'" +
            "}";
    }
}
