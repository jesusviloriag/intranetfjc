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
 * A DocModification.
 */
@Entity
@Table(name = "doc_modification")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "docmodification")
public class DocModification implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "date_mod")
    private LocalDate dateMod;

    @Column(name = "commit")
    private String commit;

    @Column(name = "version")
    private String version;

    @Lob
    @Column(name = "doc")
    private byte[] doc;

    @Column(name = "doc_content_type")
    private String docContentType;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("docModifications")
    private User author;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("docModifications")
    private Document docMod;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateMod() {
        return dateMod;
    }

    public DocModification dateMod(LocalDate dateMod) {
        this.dateMod = dateMod;
        return this;
    }

    public void setDateMod(LocalDate dateMod) {
        this.dateMod = dateMod;
    }

    public String getCommit() {
        return commit;
    }

    public DocModification commit(String commit) {
        this.commit = commit;
        return this;
    }

    public void setCommit(String commit) {
        this.commit = commit;
    }

    public String getVersion() {
        return version;
    }

    public DocModification version(String version) {
        this.version = version;
        return this;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public byte[] getDoc() {
        return doc;
    }

    public DocModification doc(byte[] doc) {
        this.doc = doc;
        return this;
    }

    public void setDoc(byte[] doc) {
        this.doc = doc;
    }

    public String getDocContentType() {
        return docContentType;
    }

    public DocModification docContentType(String docContentType) {
        this.docContentType = docContentType;
        return this;
    }

    public void setDocContentType(String docContentType) {
        this.docContentType = docContentType;
    }

    public User getAuthor() {
        return author;
    }

    public DocModification author(User user) {
        this.author = user;
        return this;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Document getDocMod() {
        return docMod;
    }

    public DocModification docMod(Document document) {
        this.docMod = document;
        return this;
    }

    public void setDocMod(Document document) {
        this.docMod = document;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DocModification)) {
            return false;
        }
        return id != null && id.equals(((DocModification) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "DocModification{" +
            "id=" + getId() +
            ", dateMod='" + getDateMod() + "'" +
            ", commit='" + getCommit() + "'" +
            ", version='" + getVersion() + "'" +
            ", doc='" + getDoc() + "'" +
            ", docContentType='" + getDocContentType() + "'" +
            "}";
    }
}
