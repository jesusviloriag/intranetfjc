import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IDocModification } from 'app/shared/model/doc-modification.model';

@Component({
  selector: 'jhi-doc-modification-detail',
  templateUrl: './doc-modification-detail.component.html',
  styles : ['.mainContent: width:100%; margin-top: 40px; margin-bottom: 20px;']
})
export class DocModificationDetailComponent implements OnInit {
  docModification: IDocModification;
  isLoading: boolean;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.data.subscribe(({ docModification }) => {
      this.docModification = docModification;
      this.isLoading = false;
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
