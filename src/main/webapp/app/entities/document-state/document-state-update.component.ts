import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IDocumentState, DocumentState } from 'app/shared/model/document-state.model';
import { DocumentStateService } from './document-state.service';

@Component({
  selector: 'jhi-document-state-update',
  templateUrl: './document-state-update.component.html',
  styleUrls: ['./document-state-update.component.scss']
})
export class DocumentStateUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    nameEs: [null, [Validators.required]],
    nameEn: [],
    descriptionEs: [],
    descriptionEn: []
  });

  constructor(protected documentStateService: DocumentStateService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ documentState }) => {
      this.updateForm(documentState);
    });
  }

  updateForm(documentState: IDocumentState) {
    this.editForm.patchValue({
      id: documentState.id,
      nameEs: documentState.nameEs,
      nameEn: documentState.nameEn,
      descriptionEs: documentState.descriptionEs,
      descriptionEn: documentState.descriptionEn
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const documentState = this.createFromForm();
    if (documentState.id !== undefined) {
      this.subscribeToSaveResponse(this.documentStateService.update(documentState));
    } else {
      this.subscribeToSaveResponse(this.documentStateService.create(documentState));
    }
  }

  private createFromForm(): IDocumentState {
    return {
      ...new DocumentState(),
      id: this.editForm.get(['id']).value,
      nameEs: this.editForm.get(['nameEs']).value,
      nameEn: this.editForm.get(['nameEn']).value,
      descriptionEs: this.editForm.get(['descriptionEs']).value,
      descriptionEn: this.editForm.get(['descriptionEn']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentState>>) {
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
