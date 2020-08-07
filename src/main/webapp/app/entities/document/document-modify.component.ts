import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IDocument, Document } from 'app/shared/model/document.model';
import { DocumentService } from './document.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IDocModification, DocModification } from 'app/shared/model/doc-modification.model';
import { DocModificationService } from '../doc-modification/doc-modification.service';

@Component({
  selector: 'jhi-document-modify',
  templateUrl: './document-modify.component.html',
  styleUrls: ['./document-modify.component.scss']
})
export class DocumentModifyComponent implements OnInit {
  isSaving: boolean;
  currentDoc;
  currentDocByte;
  users: IUser[];
  dateCreationDp: any;
  mods: any;
  editForm = this.fb.group({
    id: [],
    codDoc: [null, [Validators.required]],
    nameDoc: [],
    storage: [],
    dateCreation: [],
    departament: [],
    state: [],
    type: [],
    duration: [],
    finalDisposition: [],
    origin: [],
    doc: [],
    docContentType: [],
    creator: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected documentService: DocumentService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected docModificationService: DocModificationService,
    private route: Router
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ document }) => {
      this.updateForm(document);
      // eslint-disable-next-line no-console
      console.log(document);
      this.docModificationService
        .findLastByRel(document.id)
        .subscribe((res: HttpResponse<IDocModification[]>) => this.getLastMod(res.body));
    });
    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(document: IDocument) {
    this.editForm.patchValue({
      id: document.id,
      codDoc: document.codDoc,
      nameDoc: document.nameDoc,
      storage: document.storage,
      dateCreation: document.dateCreation,
      departament: document.departament,
      state: document.state,
      type: document.type,
      duration: document.duration,
      finalDisposition: document.finalDisposition,
      origin: document.origin,
      doc: document.doc,
      docContentType: document.docContentType,
      creator: document.creator
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
    const modification = this.createFromDoc(this.mods[0].docMod);
    this.subscribeToSaveResponseDoc(this.docModificationService.create(modification));
  }

  private createFromDoc(IDoc) {
    const newVersion = Number(this.mods[0].version) + 1;
    return {
      ...new DocModification(),
      id: null,
      dateMod: moment(),
      commit: 'Modificación al documento',
      version: `${newVersion}.0`,
      docContentType: this.editForm.get(['docContentType']).value,
      doc: this.editForm.get(['doc']).value,
      author: this.editForm.get(['creator']).value,
      docMod: IDoc
    };
  }

  protected subscribeToSaveResponseDoc(result: Observable<HttpResponse<IDocModification>>) {
    result.subscribe(() => this.onSaveSuccessDocMod(), () => this.onSaveError());
  }

  protected onSaveSuccessDocMod() {
    const document = this.createFromForm();
    this.subscribeToSaveResponse(this.documentService.update(document));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocument>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.route.navigateByUrl('/document/search');
  }

  private createFromForm(): IDocument {
    return {
      ...new Document(),
      id: this.editForm.get(['id']).value,
      codDoc: this.editForm.get(['codDoc']).value,
      nameDoc: this.editForm.get(['nameDoc']).value,
      storage: this.editForm.get(['storage']).value,
      dateCreation: this.editForm.get(['dateCreation']).value,
      departament: this.editForm.get(['departament']).value,
      state: this.editForm.get(['state']).value,
      type: this.editForm.get(['type']).value,
      duration: this.editForm.get(['duration']).value,
      finalDisposition: this.editForm.get(['finalDisposition']).value,
      origin: this.editForm.get(['origin']).value,
      docContentType: this.editForm.get(['docContentType']).value,
      doc: this.editForm.get(['doc']).value,
      creator: this.editForm.get(['creator']).value
    };
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  protected getLastMod(res) {
    // eslint-disable-next-line no-console
    console.log(res);
    this.mods = res;

    this.currentDoc = this.mods[0].doc;
    this.currentDocByte = this.mods[0].docContentType;

    this.editForm.patchValue({
      doc: this.currentDoc,
      docContentType: this.currentDocByte
    });
  }
}
