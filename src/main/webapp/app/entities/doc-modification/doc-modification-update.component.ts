import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IDocModification, DocModification } from 'app/shared/model/doc-modification.model';
import { DocModificationService } from './doc-modification.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IDocument } from 'app/shared/model/document.model';
import { DocumentService } from 'app/entities/document/document.service';

@Component({
  selector: 'jhi-doc-modification-update',
  templateUrl: './doc-modification-update.component.html',
  styleUrls: ['./doc-modification-update.component.scss']
})
export class DocModificationUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  documents: IDocument[];
  dateModDp: any;

  editForm = this.fb.group({
    id: [],
    dateMod: [],
    commit: [],
    version: [],
    doc: [],
    docContentType: [],
    author: [null, Validators.required],
    docMod: [null, Validators.required]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected docModificationService: DocModificationService,
    protected userService: UserService,
    protected documentService: DocumentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = true;
    this.activatedRoute.data.subscribe(({ docModification }) => {
      this.updateForm(docModification);
    });
    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));
    this.documentService
      .query()
      .subscribe((res: HttpResponse<IDocument[]>) => (this.documents = res.body), (res: HttpErrorResponse) => this.onError(res.message));
      this.isSaving = false;
  }

  updateForm(docModification: IDocModification) {
    this.editForm.patchValue({
      id: docModification.id,
      dateMod: docModification.dateMod,
      commit: docModification.commit,
      version: docModification.version,
      doc: docModification.doc,
      docContentType: docModification.docContentType,
      author: docModification.author,
      docMod: docModification.docMod
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
    const docModification = this.createFromForm();
    if (docModification.id !== undefined) {
      this.subscribeToSaveResponse(this.docModificationService.update(docModification));
    } else {
      this.subscribeToSaveResponse(this.docModificationService.create(docModification));
    }
  }

  private createFromForm(): IDocModification {
    return {
      ...new DocModification(),
      id: this.editForm.get(['id']).value,
      dateMod: this.editForm.get(['dateMod']).value,
      commit: this.editForm.get(['commit']).value,
      version: this.editForm.get(['version']).value,
      docContentType: this.editForm.get(['docContentType']).value,
      doc: this.editForm.get(['doc']).value,
      author: this.editForm.get(['author']).value,
      docMod: this.editForm.get(['docMod']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocModification>>) {
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

  trackDocumentById(index: number, item: IDocument) {
    return item.id;
  }

   clearInput(id, idForm) {
    const input = document.getElementById(id) as HTMLInputElement;
    input.value = null;
    this.editForm.patchValue({ [idForm]: null });
  }
}
