import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { IDocument } from 'app/shared/model/document.model';

import { DocumentService } from './document.service';
import { JhiLanguageService } from 'ng-jhipster';

import { DocModificationService } from '../doc-modification/doc-modification.service';
import { IDocModification } from 'app/shared/model/doc-modification.model';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'jhi-document-master',
  templateUrl: './document-master.component.html',
  styleUrls: ['./document-master.component.scss']
})
export class DocumentMasterComponent implements OnInit {
  isSaving: boolean;
  documents: IDocument[];
  currentSearch: string;
  routeData: any;
  docMod = [];

  constructor(
    protected documentService: DocumentService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private languageService: JhiLanguageService,
    protected docModificationService: DocModificationService
  ) {}

  loadAll() {
    this.documentService.findAll('all').subscribe((res: HttpResponse<IDocument[]>) => this.paginateDocuments(res.body));
  }

  ngOnInit() {
    this.isSaving = true;
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.loadAll();
  }

  generatePdf() {
    if (this.documents.length === 0) {
      alert('No existen documentos para exportar');
    } else {
      let table = '';
      table += `
      <table style="width: 100%;font-size: 9px;text-align:center;" data-pdfmake="{&quot;widths&quot;:[&quot;*&quot;,&quot;*&quot;,&quot;*&quot;,&quot;*&quot;,&quot;*&quot;,&quot;*&quot;,&quot;*&quot;,&quot;*&quot;,&quot;*&quot;],&quot;heights&quot;:40}">
      <thead>
        <tr>
          <th>${this.getLabel('Code', 'Código')}</th>
          <th>${this.getLabel('Origin', 'Origen')}</th>
          <th>${this.getLabel('Name', 'Nombre')}</th>
          <th>${this.getLabel('Creation D.', 'F. Creación')}</th>
          <th>${this.getLabel('Revision', 'Revisión')}</th>
          <th>${this.getLabel('Revision D.', 'F. Revisión')}</th>
          <th>${this.getLabel('Storage', 'Almacenaje')}</th>
          <th>${this.getLabel('Retention', 'Retención')}</th>
          <th>${this.getLabel('Final Disposition', 'Disposición F.')}</th>
        </tr>
      </thead>
      <tbody>`;

      for (let i = 0; i < this.documents.length; i++) {
        table += `
        <tr>
          <td>${this.documents[i].codDoc}</td>
          <td>I/E</td>
          <td>${this.documents[i].nameDoc}</td>
          <td>${this.documents[i].dateCreation.format('DD/MM/YYYY')}</td>
          <td>${this.docMod[i][0].version}</td>
          <td>${this.docMod[i][0].dateMod.format('DD/MM/YYYY')}</td>
          <td>${this.getStorage(+this.documents[i].storage)}</td>
          <td>${this.getDuration(+this.documents[i].duration)}</td>
          <td>${this.getFinalDiposition(+this.documents[i].finalDisposition)}</td>
        </tr>
        `;
      }
      table += `
      </tbody>
      </table>`;
      // eslint-disable-next-line no-console
      console.log(table);
      const html = htmlToPdfmake(table);
      const content = {
        content: [html],
        pageOrientation: 'landscape'
      };

      pdfMake.createPdf(content).download(`${this.getLabel('master_list_', 'lista_maestra_')}${moment().format('DD-MM-YYYY')}`);
    }
  }

  public getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }

  protected paginateDocuments(data: IDocument[]) {
    this.documents = data;
    const total = data.length - 1;
    this.recursiveSearchMod(data, total, 0);
  }

  protected recursiveSearchMod(data, total, index) {
    this.docModificationService
      .findLastByRel(data[index].id)
      .subscribe((res: HttpResponse<IDocModification[]>) => this.getLastMod(data, total, index, res.body));
  }

  protected getLastMod(data, total, index, res) {
    this.docMod.push(res);
    index++;
    if (!(index > total)) {
      this.recursiveSearchMod(data, total, index);
    } else {
      this.isSaving = false;
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
  }

  protected getStorage(num: number) {
    let value;
    switch (num) {
      case 0:
        value = this.getLabel('Digital', 'Digital');
        break;
      case 1:
        value = this.getLabel('Physical', 'Fisico');
        break;
      case 2:
        value = this.getLabel('D/P', 'D/F');
        break;
      default:
        value = 'error';
    }
    return value;
  }

  protected getFinalDiposition(num: number) {
    let value;
    switch (num) {
      case 1:
        value = this.getLabel('Delete', 'Eliminar');
        break;
      case 2:
        value = this.getLabel('Update', 'Actualizar');
        break;
      case 3:
        value = this.getLabel('Archive', 'Archivar');
        break;
      default:
        value = 'error';
    }
    return value;
  }

  protected getDuration(num: number) {
    let value;
    switch (num) {
      case 0:
        value = this.getLabel('Permanent', 'Permanente');
        break;
      case 1:
        value = this.getLabel('1 year', '1 año');
        break;
      case 2:
        value = this.getLabel('2 years', '2 años');
        break;
      case 3:
        value = this.getLabel('3 years', '3 años');
        break;
      case 4:
        value = this.getLabel('4 years', '4 años');
        break;
      case 5:
        value = this.getLabel('5 years', '5 años');
        break;
      case 6:
        value = this.getLabel('6 years', '6 años');
        break;
      case 7:
        value = this.getLabel('7 years', '7 años');
        break;
      case 8:
        value = this.getLabel('8 years', '8 años');
        break;
      case 9:
        value = this.getLabel('9 years', '9 años');
        break;
      case 10:
        value = this.getLabel('10 years', '10 años');
        break;
      default:
        value = 'error';
    }
    return value;
  }
}
