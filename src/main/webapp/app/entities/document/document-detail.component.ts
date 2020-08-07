import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IDocument } from 'app/shared/model/document.model';

@Component({
  selector: 'jhi-document-detail',
  templateUrl: './document-detail.component.html',
  styles: ['.mainContent { margin-top: 90px;margin-bottom: 20px;}']
})
export class DocumentDetailComponent implements OnInit {
  document: IDocument;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ document }) => {
      this.document = document;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
