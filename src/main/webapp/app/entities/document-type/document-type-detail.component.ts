import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentType } from 'app/shared/model/document-type.model';

@Component({
  selector: 'jhi-document-type-detail',
  templateUrl: './document-type-detail.component.html'
})
export class DocumentTypeDetailComponent implements OnInit {
  documentType: IDocumentType;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ documentType }) => {
      this.documentType = documentType;
    });
  }

  previousState() {
    window.history.back();
  }
}
