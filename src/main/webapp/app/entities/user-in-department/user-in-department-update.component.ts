import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { IUserInDepartment, UserInDepartment } from 'app/shared/model/user-in-department.model';
import { UserInDepartmentService } from './user-in-department.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IDepartament } from 'app/shared/model/departament.model';
import { DepartamentService } from 'app/entities/departament/departament.service';

@Component({
  selector: 'jhi-user-in-department-update',
  templateUrl: './user-in-department-update.component.html',
  styleUrls: ['./user-in-department-update.component.scss']
})
export class UserInDepartmentUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  departaments: IDepartament[];

  editForm = this.fb.group({
    id: [],
    user: [null, Validators.required],
    departament: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected userInDepartmentService: UserInDepartmentService,
    protected userService: UserService,
    protected departamentService: DepartamentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ userInDepartment }) => {
      this.updateForm(userInDepartment);
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
  }

  updateForm(userInDepartment: IUserInDepartment) {
    this.editForm.patchValue({
      id: userInDepartment.id,
      user: userInDepartment.user,
      departament: userInDepartment.departament
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const userInDepartment = this.createFromForm();
    if (userInDepartment.id !== undefined) {
      this.subscribeToSaveResponse(this.userInDepartmentService.update(userInDepartment));
    } else {
      this.subscribeToSaveResponse(this.userInDepartmentService.create(userInDepartment));
    }
  }

  private createFromForm(): IUserInDepartment {
    return {
      ...new UserInDepartment(),
      id: this.editForm.get(['id']).value,
      user: this.editForm.get(['user']).value,
      departament: this.editForm.get(['departament']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserInDepartment>>) {
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
}
