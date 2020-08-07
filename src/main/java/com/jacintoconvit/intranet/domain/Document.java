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
 * A Document.
 */
@Entity
@Table(name = "document")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "document")
public class Document implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Column(name = "cod_doc", nullable = false)
    private String codDoc;

    @Column(name = "name_doc")
    private String nameDoc;

    @Column(name = "storage")
    private String storage;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Column(name = "duration")
    private String duration;

    @Column(name = "final_disposition")
    private String finalDisposition;

    @Column(name = "origin")
    private Integer origin;

    @Lob
    @Column(name = "doc")
    private byte[] doc;

    @Column(name = "doc_content_type")
    private String docContentType;

    @Column(name = "content")
    private String content;

    @ManyToOne
    @JsonIgnoreProperties("documents")
    private User creator;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("documents")
    private Departament departament;

    @ManyToOne
    @JsonIgnoreProperties("documents")
    private DocumentState state;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("documents")
    private DocumentType type;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodDoc() {
        return codDoc;
    }

    public Document codDoc(String codDoc) {
        this.codDoc = codDoc;
        return this;
    }

    public void setCodDoc(String codDoc) {
        this.codDoc = codDoc;
    }

    public String getNameDoc() {
        return nameDoc;
    }

    public Document nameDoc(String nameDoc) {
        this.nameDoc = nameDoc;
        return this;
    }

    public void setNameDoc(String nameDoc) {
        this.nameDoc = nameDoc;
    }

    public String getStorage() {
        return storage;
    }

    public Document storage(String storage) {
        this.storage = storage;
        return this;
    }

    public void setStorage(String storage) {
        this.storage = storage;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public Document dateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
        return this;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getDuration() {
        return duration;
    }

    public Document duration(String duration) {
        this.duration = duration;
        return this;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getFinalDisposition() {
        return finalDisposition;
    }

    public Document finalDisposition(String finalDisposition) {
        this.finalDisposition = finalDisposition;
        return this;
    }

    public void setFinalDisposition(String finalDisposition) {
        this.finalDisposition = finalDisposition;
    }

    public Integer getOrigin() {
        return origin;
    }

    public Document origin(Integer origin) {
        this.origin = origin;
        return this;
    }

    public void setOrigin(Integer origin) {
        this.origin = origin;
    }

    public byte[] getDoc() {
        return doc;
    }

    public Document doc(byte[] doc) {
        this.doc = doc;
        return this;
    }

    public void setDoc(byte[] doc) {
        this.doc = doc;
    }

    public String getDocContentType() {
        return docContentType;
    }

    public Document docContentType(String docContentType) {
        this.docContentType = docContentType;
        return this;
    }

    public void setDocContentType(String docContentType) {
        this.docContentType = docContentType;
    }

    public String getContent() {
        return content;
    }

    public Document content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getCreator() {
        return creator;
    }

    public Document creator(User user) {
        this.creator = user;
        return this;
    }

    public void setCreator(User user) {
        this.creator = user;
    }

    public Departament getDepartament() {
        return departament;
    }

    public Document departament(Departament departament) {
        this.departament = departament;
        return this;
    }

    public void setDepartament(Departament departament) {
        this.departament = departament;
    }

    public DocumentState getState() {
        return state;
    }

    public Document state(DocumentState documentState) {
        this.state = documentState;
        return this;
    }

    public void setState(DocumentState documentState) {
        this.state = documentState;
    }

    public DocumentType getType() {
        return type;
    }

    public Document type(DocumentType documentType) {
        this.type = documentType;
        return this;
    }

    public void setType(DocumentType documentType) {
        this.type = documentType;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Document)) {
            return false;
        }
        return id != null && id.equals(((Document) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Document{" +
            "id=" + getId() +
            ", codDoc='" + getCodDoc() + "'" +
            ", nameDoc='" + getNameDoc() + "'" +
            ", storage='" + getStorage() + "'" +
            ", dateCreation='" + getDateCreation() + "'" +
            ", duration='" + getDuration() + "'" +
            ", finalDisposition='" + getFinalDisposition() + "'" +
            ", origin=" + getOrigin() +
            ", doc='" + getDoc() + "'" +
            ", docContentType='" + getDocContentType() + "'" +
            ", content='" + getContent() + "'" +
            "}";
    }
}
