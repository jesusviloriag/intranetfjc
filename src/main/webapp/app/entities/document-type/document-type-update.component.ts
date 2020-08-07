import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IDocumentType, DocumentType } from 'app/shared/model/document-type.model';
import { DocumentTypeService } from './document-type.service';

@Component({
  selector: 'jhi-document-type-update',
  templateUrl: './document-type-update.component.html'
})
export class DocumentTypeUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: []
  });

  constructor(protected documentTypeService: DocumentTypeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ documentType }) => {
      this.updateForm(documentType);
    });
  }

  updateForm(documentType: IDocumentType) {
    this.editForm.patchValue({
      id: documentType.id,
      name: documentType.name,
      description: documentType.description
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const documentType = this.createFromForm();
    if (documentType.id !== undefined) {
      this.subscribeToSaveResponse(this.documentTypeService.update(documentType));
    } else {
      this.subscribeToSaveResponse(this.documentTypeService.create(documentType));
    }
  }

  private createFromForm(): IDocumentType {
    return {
      ...new DocumentType(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      description: this.editForm.get(['description']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentType>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
