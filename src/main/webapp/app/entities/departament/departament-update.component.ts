import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IDepartament, Departament } from 'app/shared/model/departament.model';
import { DepartamentService } from './departament.service';

@Component({
  selector: 'jhi-departament-update',
  templateUrl: './departament-update.component.html'
})
export class DepartamentUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    nameDepartament: [],
    idDepartament: [],
    shortDsc: []
  });

  constructor(protected departamentService: DepartamentService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ departament }) => {
      this.updateForm(departament);
    });
  }

  updateForm(departament: IDepartament) {
    this.editForm.patchValue({
      id: departament.id,
      nameDepartament: departament.nameDepartament,
      idDepartament: departament.idDepartament,
      shortDsc: departament.shortDsc
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const departament = this.createFromForm();
    if (departament.id !== undefined) {
      this.subscribeToSaveResponse(this.departamentService.update(departament));
    } else {
      this.subscribeToSaveResponse(this.departamentService.create(departament));
    }
  }

  private createFromForm(): IDepartament {
    return {
      ...new Departament(),
      id: this.editForm.get(['id']).value,
      nameDepartament: this.editForm.get(['nameDepartament']).value,
      idDepartament: this.editForm.get(['idDepartament']).value,
      shortDsc: this.editForm.get(['shortDsc']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartament>>) {
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
