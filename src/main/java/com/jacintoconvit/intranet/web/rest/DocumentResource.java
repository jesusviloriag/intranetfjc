package com.jacintoconvit.intranet.web.rest;

import java.time.LocalDate;
import com.jacintoconvit.intranet.domain.Document;
import com.jacintoconvit.intranet.repository.DocumentRepository;
import com.jacintoconvit.intranet.repository.search.DocumentSearchRepository;
import com.jacintoconvit.intranet.web.rest.errors.BadRequestAlertException;
import java.text.SimpleDateFormat;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ByteArrayResource;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.AbstractPageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import javax.validation.Valid;
import java.net.URI;
import java.util.Base64;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xwpf.model.XWPFHeaderFooterPolicy;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFFooter;
import org.apache.poi.xwpf.usermodel.XWPFHeader;
import org.apache.poi.xwpf.usermodel.XWPFHeaderFooter;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import java.io.*;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.util.Iterator;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.jacintoconvit.intranet.domain.Document}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DocumentResource {

    private final Logger log = LoggerFactory.getLogger(DocumentResource.class);

    private static final String ENTITY_NAME = "document";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentRepository documentRepository;

    private final DocumentSearchRepository documentSearchRepository;

    public DocumentResource(DocumentRepository documentRepository, DocumentSearchRepository documentSearchRepository) {
        this.documentRepository = documentRepository;
        this.documentSearchRepository = documentSearchRepository;
    }

    /**
     * {@code POST  /documents} : Create a new document.
     *
     * @param document the document to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new document, or with status {@code 400 (Bad Request)} if the document has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/documents")
    public ResponseEntity<Document> createDocument(@Valid @RequestBody Document document) throws URISyntaxException {
        log.debug("REST request to save Document : {}", document);
        if (document.getId() != null) {
            throw new BadRequestAlertException("A new document cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Document result = documentRepository.save(document);
        documentSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/documents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /documents} : Updates an existing document.
     *
     * @param document the document to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated document,
     * or with status {@code 400 (Bad Request)} if the document is not valid,
     * or with status {@code 500 (Internal Server Error)} if the document couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/documents")
    public ResponseEntity<Document> updateDocument(@Valid @RequestBody Document document) throws URISyntaxException {
        log.debug("REST request to update Document : {}", document);
        if (document.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Document result = documentRepository.save(document);
        documentSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, document.getId().toString()))
            .body(result);
    }


    /**
     * {@code GET  /documents/createDocument/{info}} : create a document.
     *
     * @param info
     * @param docType
     * @param nameDoc
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @GetMapping("documents/createDocument/{info}&doc={docType}&nameDoc={nameDoc}")
    public ResponseEntity<String[]> createDocument(@PathVariable String info, @PathVariable String docType, @PathVariable String nameDoc) throws Exception {

        //Los documentos tienen nombres diferentes, ajustalos a tu PATH cuando vayas a hacer la prueba.

        log.debug("REST REQUEST TO MAKE A DOCUMENT.--------------------------------------------------");
        String[] items = info.split("~");

        if((docType).equals("word")){
        XWPFDocument document = new XWPFDocument(new FileInputStream("C:/Users/Samue/Desktop/fjcintranet/document-templates/" + nameDoc + ".docx"));
        String result1 = items[0];
        String result2 = items[1];
        String result3 = items[2];
        String result4 = items[3];
        XWPFHeaderFooterPolicy policy = new XWPFHeaderFooterPolicy(document);
        XWPFHeader header = policy. getDefaultHeader();
        XWPFTable table = header.getTableArray(0);
        List<XWPFTableRow> tableRows = table.getRows();
        for (XWPFTableRow tableRow : tableRows) {
            List<XWPFTableCell> tableCells = tableRow.getTableCells();
            for(XWPFTableCell tableCell : tableCells) {
                for(XWPFParagraph paragraph: tableCell.getParagraphs()){
                    for(XWPFRun run : paragraph.getRuns()) {
                        String data = run.getText(0);
                        if (data != null && data.contains("${value1}")) {
                            System.out.println("Aqui esta value 1");
                            data = data.replace("${value1}", result1);
                            run.setText(data,0);
                        }
                        if (data != null && data.contains("${value2}")) {
                            System.out.println("Aqui esta value 2");
                            data = data.replace("${value2}", result2);
                            run.setText(data,0);
                        }
                        if (data != null && data.contains("${value3}")) {
                            System.out.println("Aqui esta value 3");
                            data = data.replace("${value3}", result3);
                            run.setText(data,0);
                        }
                        if (data != null && data.contains("${value4}")) {
                            System.out.println("Aqui esta value 4");
                            data = data.replace("${value4}", result4);
                            run.setText(data,0);
                        }
                    }
                }
            }
        }
        document.write(new FileOutputStream("C:/Users/Samue/Desktop/fjcintranet/document-templates/res1.docx"));
        log.debug("DOCUMENT CREATEDD");
        document.close();

        Path path = new File("C:/Users/Samue/Desktop/fjcintranet/document-templates/res1.docx").toPath();
        String mimeType = Files.probeContentType(path);

        //File yourFile = new File("C:/Users/Samue/Desktop/intranet/document-templates/res1.docx");

        byte[] input_file = Files.readAllBytes(Paths.get("C:/Users/Samue/Desktop/fjcintranet/document-templates/res1.docx"));
        byte[] encodedBytes = Base64.getEncoder().encode(input_file);
        String encodedString =  new String(encodedBytes);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment;filename=res1.docx");

        String[] res = new String[] {encodedString, mimeType};
        return ResponseEntity.ok().headers(headers).body(res);

    }else if((docType).equals("excel")){

        Workbook workbook = new XSSFWorkbook(new FileInputStream("C:/Users/Samue/Desktop/fjcintranet/document-templates/" + nameDoc + ".xlsx"));
        Sheet firstSheet = workbook.getSheetAt(0);
        Iterator<Row> iterator = firstSheet.iterator();
        String result1 = items[0];
        String result2 = items[1];
        String result3 = items[2];
        String result4 = items[3];

        while (iterator.hasNext()) {
            Row nextRow = (Row) iterator.next();
            Iterator<Cell> cellIterator = nextRow.cellIterator();

            while (cellIterator.hasNext()) {
                Cell cell = (Cell) cellIterator.next();
                switch (cell.getCellType()) {
                    case STRING:
                       String value = cell.getStringCellValue();
                       if (value != null && value.contains("${value1}")) {
                           System.out.println("Aqui esta value 1");
                           value = value.replace("${value1}", result1);
                           cell.setCellValue(value);
                       }
                       if (value != null && value.contains("${value2}")) {
                           System.out.println("Aqui esta value 2");
                           value = value.replace("${value2}", result2);
                           cell.setCellValue(value);
                       }
                       if (value != null && value.contains("${value3}")) {
                           System.out.println("Aqui esta value 3");
                           value = value.replace("${value3}", result3);
                           cell.setCellValue(value);
                       }
                       if (value != null && value.contains("${value4}")) {
                           System.out.println("Aqui esta value 4");
                           value = value.replace("${value4}", result4);
                           cell.setCellValue(value);
                       }
                        break;
                }
            }
        }
        //Cierre de los ciclos while
        workbook.write(new FileOutputStream("C:/Users/Samue/Desktop/fjcintranet/document-templates/resultado1.xlsx"));
        log.debug("Documento creado");

        //File yourFile = new File("C:/Users/Samue/Desktop/intranet/document-templates/res1.docx");

        byte[] input_file = Files.readAllBytes(Paths.get("C:/Users/Samue/Desktop/fjcintranet/document-templates/resultado1.xlsx"));
        Path path = new File("C:/Users/Samue/Desktop/fjcintranet/document-templates/resultado1.xlsx").toPath();
        String mimeType = Files.probeContentType(path);

        byte[] encodedBytes = Base64.getEncoder().encode(input_file);
        String encodedString =  new String(encodedBytes);
        HttpHeaders headers = new HttpHeaders();
        workbook.close();
        headers.add("Content-Disposition", "attachment;filename=resultado1.xlsx");
        String[] res = new String[] {encodedString, mimeType};
        return ResponseEntity.ok().headers(headers).body(res);

    }else{
        //Opciones para los demas documentos.
    }
    byte[] input_file = Files.readAllBytes(Paths.get("C:/Users/Samue/Desktop/fjcintranet/document-templates/res1.docx"));
    Path path = new File("C:/Users/Samue/Desktop/fjcintranet/document-templates/res1.docx").toPath();
    String mimeType = Files.probeContentType(path);
    byte[] encodedBytes = Base64.getEncoder().encode(input_file);
    String encodedString =  new String(encodedBytes);
    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Disposition", "attachment;filename=res1.docx");
    String[] res = new String[] {encodedString, mimeType};
    return ResponseEntity.ok().headers(headers).body(res);
   }

    /**
     * {@code GET  /documents} : get all the documents.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documents in body.
     */
    @GetMapping("/documents")
    public ResponseEntity<List<Document>> getAllDocuments(Pageable pageable) {
        log.debug("REST request to get a page of Documents");
        Page<Document> page = documentRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /documents} : get all the documents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documents in body.
     */
    @GetMapping("/documents/pdf/all")
    public ResponseEntity<List<Document>> getAllDocumentsReal() {
        log.debug("REST request to get a page of Documents");
        Pageable pageable = Pageable.unpaged();
        Page<Document> page = documentRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /documents/:id} : get the "id" document.
     *
     * @param id the id of the document to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the document, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/documents/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        log.debug("REST request to get Document : {}", id);
        Optional<Document> document = documentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(document);
    }

    /**
     * {@code DELETE  /documents/:id} : delete the "id" document.
     *
     * @param id the id of the document to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        log.debug("REST request to delete Document : {}", id);
        documentRepository.deleteById(id);
        documentSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/documents?query=:query} : search for the document corresponding
     * to the query.
     *
     * @param query the query of the document search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/documents")
    public ResponseEntity<List<Document>> searchDocuments(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Documents for query {}", query);
        Page<Document> page = documentSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /documents/:status&:dateLimit&:typeDoc&:order&:direction} .
     *
     * @param status
     * @param dateLimit
     * @param order
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documents in body.
     */
    @GetMapping("/documents/records/{status}&{dateLimit}&{order}")
    public ResponseEntity<List<Document>> searchDocFilter(@PathVariable Long status, @PathVariable String dateLimit, @PathVariable String order, Pageable pageable) {
      log.debug("REST request to get a page of Documents");
      String[] items = order.split("-");
      String orderItem = items[0];
      String direction = items[1];
      int currentPage = Integer.parseInt(items[2]);
      Long dpte = Long.parseLong(items[3]);
      log.debug("REST request to get a page of Documentaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaas {} {} {}",orderItem, direction, currentPage);
      Page page = null;

      if((direction).equals("DESC")){
        pageable = PageRequest.of(currentPage, 20, Sort.by(orderItem).descending());
      }else{
        pageable = PageRequest.of(currentPage, 20, Sort.by(orderItem).ascending());
      }

      if(status != 0 || !(dateLimit).equals("no")){  //ID = no es para DATOS QUE NO SE DEBEN FILTRAR COMO QUE REJECTED?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????/

        if(status != 0 && !(dateLimit).equals("no")){
          LocalDate date1 = LocalDate.parse(dateLimit);
          page = documentRepository.findByDateCreationLessThanEqualAndState_IdEqualsAndDepartament_IdEquals(date1, status, dpte, pageable);
        }

        if(status != 0 && (dateLimit).equals("no")){
          page = documentRepository.findByState_IdEqualsAndDepartament_IdEquals(status, dpte, pageable);
        }

        if(status == 0 && !(dateLimit).equals("no")){
          LocalDate date1 = LocalDate.parse(dateLimit);
          page = documentRepository.findByDateCreationLessThanEqualAndDepartament_IdEquals(date1, dpte, pageable);
        }
      }else{
        page = documentRepository.findByDepartament_IdEquals(dpte, pageable);
      }

      HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
      return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
