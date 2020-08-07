import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentState } from 'app/shared/model/document-state.model';

@Component({
  selector: 'jhi-document-state-detail',
  templateUrl: './document-state-detail.component.html',
  styles: ['.mainContent { margin-top: 90px;margin-bottom: 20px; width: 100%;}']
})
export class DocumentStateDetailComponent implements OnInit {
  documentState: IDocumentState;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ documentState }) => {
      this.documentState = documentState;
    });
  }

  previousState() {
    window.history.back();
  }
}
