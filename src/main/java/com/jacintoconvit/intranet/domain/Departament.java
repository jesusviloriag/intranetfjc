package com.jacintoconvit.intranet.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A Departament.
 */
@Entity
@Table(name = "departament")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "departament")
public class Departament implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "name_departament")
    private String nameDepartament;

    @Column(name = "id_departament")
    private Integer idDepartament;

    @Column(name = "short_dsc")
    private String shortDsc;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameDepartament() {
        return nameDepartament;
    }

    public Departament nameDepartament(String nameDepartament) {
        this.nameDepartament = nameDepartament;
        return this;
    }

    public void setNameDepartament(String nameDepartament) {
        this.nameDepartament = nameDepartament;
    }

    public Integer getIdDepartament() {
        return idDepartament;
    }

    public Departament idDepartament(Integer idDepartament) {
        this.idDepartament = idDepartament;
        return this;
    }

    public void setIdDepartament(Integer idDepartament) {
        this.idDepartament = idDepartament;
    }

    public String getShortDsc() {
        return shortDsc;
    }

    public Departament shortDsc(String shortDsc) {
        this.shortDsc = shortDsc;
        return this;
    }

    public void setShortDsc(String shortDsc) {
        this.shortDsc = shortDsc;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Departament)) {
            return false;
        }
        return id != null && id.equals(((Departament) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Departament{" +
            "id=" + getId() +
            ", nameDepartament='" + getNameDepartament() + "'" +
            ", idDepartament=" + getIdDepartament() +
            ", shortDsc='" + getShortDsc() + "'" +
            "}";
    }
}
