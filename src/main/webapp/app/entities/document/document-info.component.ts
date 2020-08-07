import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { IDocument } from 'app/shared/model/document.model';
import { IDocModification, DocModification } from 'app/shared/model/doc-modification.model';
import { DocModificationService } from '../doc-modification/doc-modification.service';
import { UserInDepartmentService } from 'app/entities/user-in-department/user-in-department.service';

@Component({
  selector: 'jhi-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.scss']
})
export class DocumentInfoComponent implements OnInit {
  document: IDocument;
  isLoading = false;
  docModifications: any;
  currentDoc: any;
  currentDocByte: any;
  departament: any;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    private userInDepartmentService: UserInDepartmentService,
    protected docModificationService: DocModificationService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.data.subscribe(({ document }) => {
      this.document = document;
      // eslint-disable-next-line no-console
      console.log(this.document);
      this.docModificationService
        .findLastByRel(document.id)
        .subscribe((res: HttpResponse<IDocModification[]>) => this.getLastMod(res.body));
    });
    this.userInDepartmentService.findByActualUser().subscribe(res => {
      this.departament = res.body[0].departament;
      // eslint-disable-next-line no-console
      console.log(this.departament);
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

  protected getLastMod(res) {
    // eslint-disable-next-line no-console
    console.log(res);
    this.docModifications = res;

    this.currentDoc = this.docModifications[0].doc;
    this.currentDocByte = this.docModifications[0].docContentType;
  }
}
