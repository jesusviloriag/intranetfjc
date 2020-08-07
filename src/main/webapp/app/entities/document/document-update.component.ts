import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IDocument, Document } from 'app/shared/model/document.model';
import { DocumentService } from './document.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IDepartament } from 'app/shared/model/departament.model';
import { DepartamentService } from 'app/entities/departament/departament.service';
import { IDocumentState } from 'app/shared/model/document-state.model';
import { DocumentStateService } from 'app/entities/document-state/document-state.service';
import { IDocumentType } from 'app/shared/model/document-type.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';

@Component({
  selector: 'jhi-document-update',
  templateUrl: './document-update.component.html',
  styleUrls : ['./document-update.component.scss']
})
export class DocumentUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  departaments: IDepartament[];

  documentstates: IDocumentState[];

  documenttypes: IDocumentType[];
  dateCreationDp: any;

  editForm = this.fb.group({
    id: [],
    codDoc: [null, [Validators.required]],
    nameDoc: [],
    storage: [null],
    dateCreation: [],
    duration: [],
    finalDisposition: [],
    origin: [],
    doc: [],
    docContentType: [],
    content: [],
    creator: [],
    departament: [null, Validators.required],
    state: [],
    type: [null, Validators.required]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected documentService: DocumentService,
    protected userService: UserService,
    protected departamentService: DepartamentService,
    protected documentStateService: DocumentStateService,
    protected documentTypeService: DocumentTypeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ document }) => {
      this.updateForm(document);
    });
    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));
    this.departamentService
      .query()
      .subscribe(
        (res: HttpResponse<IDepartament[]>) => (this.departaments = res.body),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.documentStateService
      .query()
      .subscribe(
        (res: HttpResponse<IDocumentState[]>) => (this.documentstates = res.body),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.documentTypeService
      .query()
      .subscribe(
        (res: HttpResponse<IDocumentType[]>) => (this.documenttypes = res.body),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(document: IDocument) {
    this.editForm.patchValue({
      id: document.id,
      codDoc: document.codDoc,
      nameDoc: document.nameDoc,
      storage: document.storage,
      dateCreation: document.dateCreation,
      duration: document.duration,
      finalDisposition: document.finalDisposition,
      origin: document.origin,
      doc: document.doc,
      docContentType: document.docContentType,
      content: document.content,
      creator: document.creator,
      departament: document.departament,
      state: document.state,
      type: document.type
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file: File = event.target.files[0];
        if (isImage && !file.type.startsWith('image/')) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      // eslint-disable-next-line no-console
      () => console.log('blob added'), // success
      this.onError
    );
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const document = this.createFromForm();
    if (document.id !== undefined) {
      this.subscribeToSaveResponse(this.documentService.update(document));
    } else {
      this.subscribeToSaveResponse(this.documentService.create(document));
    }
  }

  private createFromForm(): IDocument {
    return {
      ...new Document(),
      id: this.editForm.get(['id']).value,
      codDoc: this.editForm.get(['codDoc']).value,
      nameDoc: this.editForm.get(['nameDoc']).value,
      storage: this.editForm.get(['storage']).value,
      dateCreation: this.editForm.get(['dateCreation']).value,
      duration: this.editForm.get(['duration']).value,
      finalDisposition: this.editForm.get(['finalDisposition']).value,
      origin: this.editForm.get(['origin']).value,
      docContentType: this.editForm.get(['docContentType']).value,
      doc: this.editForm.get(['doc']).value,
      content: this.editForm.get(['content']).value,
      creator: this.editForm.get(['creator']).value,
      departament: this.editForm.get(['departament']).value,
      state: this.editForm.get(['state']).value,
      type: this.editForm.get(['type']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocument>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackDepartamentById(index: number, item: IDepartament) {
    return item.id;
  }

  trackDocumentStateById(index: number, item: IDocumentState) {
    return item.id;
  }

  trackDocumentTypeById(index: number, item: IDocumentType) {
    return item.id;
  }

  clearInput(id, idForm) {
    const input = document.getElementById(id) as HTMLInputElement;
    input.value = null;
    this.editForm.patchValue({ [idForm]: null });
  }
}
