import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IActivity, Activity } from 'app/shared/model/activity.model';
import { ActivityService } from './activity.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { JhiLanguageService } from 'ng-jhipster';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-activity-update',
  templateUrl: './activity-update.component.html',
  styleUrls: ['./activity-update.component.scss']
})
export class ActivityUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];
  dateStartDp: any;
  dateLimitDp: any;
  dateClosureDp: any;
  dpte: any;

  likeUser = [];
  involvedNames = [];

  editForm = this.fb.group({
    id: [],
    nameActivity: [null, [Validators.required]],
    dateStart: [null, [Validators.required]],
    dateLimit: [null, [Validators.required]],
    description: [null, [Validators.required]],
    deliverables: [null, [Validators.required]],
    dept: ['Seleccione...', [Validators.required]],
    involvedActivity: [null],
    status: [null],
    dateClosure: [null],
    creator: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected activityService: ActivityService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public languageService: JhiLanguageService,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });
    this.activatedRoute.data.subscribe(({ activity }) => {
      this.isSaving = true;
      this.updateForm(activity);
      // eslint-disable-next-line no-console
      console.log(activity);
    });
    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(activity: IActivity) {
    if (activity.id !== undefined) {
      const arrInvolved = activity.involvedActivity.split(',');
      this.involvedNames = arrInvolved;
    }
    this.editForm.patchValue({
      id: activity.id,
      nameActivity: activity.nameActivity,
      dateStart: activity.dateStart,
      dateLimit: activity.dateLimit,
      description: activity.description,
      deliverables: activity.deliverables,
      dept: activity.dept,
      involvedActivity: '',
      status: activity.status,
      dateClosure: activity.dateClosure,
      creator: activity.creator
    });
    this.isSaving = false;
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    // 1 = CREANDO; 0 = ACTUALIZANDO
    if (this.editForm.get(['id']).value !== undefined) {
      if (this.editForm.valid && this.involvedNames.length > 0) {
        if (this.editForm.get('dateLimit').value !== null) {
          if (this.editForm.get('dateStart').value.isAfter(this.editForm.get('dateLimit').value)) {
            alert(
              `${this.getLabel(
                'The commitment date cannot be earlier than the initial',
                'La fecha de compromiso no puede ser antes a la inicial'
              )}`
            );
            this.isSaving = false;
            return 0;
          }
          if (this.editForm.get('dateLimit').value.isAfter(this.editForm.get('dateClosure').value)) {
            alert(
              `${this.getLabel(
                'The closure date cannot be earlier than the finalitation',
                'La fecha de cierre no puede ser antes a la finalización'
              )}`
            );
            this.isSaving = false;
            return 0;
          }
        }
        window.scroll(0, 0);
        this.isSaving = true;
        const activity = this.createFromForm(0);
        this.subscribeToSaveResponse(this.activityService.update(activity));
      } else {
        this.isSaving = false;
        alert(`${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`);
      }
    } else {
      if (this.editForm.valid && this.involvedNames.length > 0) {
        if (this.editForm.get('dateLimit').value !== null) {
          if (this.editForm.get('dateStart').value.isAfter(this.editForm.get('dateLimit').value)) {
            alert(
              `${this.getLabel(
                'The commitment date cannot be earlier than the initial',
                'La fecha de compromiso no puede ser antes a la inicial'
              )}`
            );
            this.isSaving = false;
            return 0;
          }
        }
        window.scroll(0, 0);
        this.isSaving = true;
        const activity = this.createFromForm(1);
        this.subscribeToSaveResponse(this.activityService.create(activity));
      } else {
        this.isSaving = false;
        alert(`${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`);
      }
    }
  }

  private createFromForm(whatDo: number): IActivity {
    return {
      ...new Activity(),
      id: this.editForm.get(['id']).value,
      nameActivity: this.editForm.get(['nameActivity']).value,
      dateStart: this.editForm.get(['dateStart']).value,
      dateLimit: this.editForm.get(['dateLimit']).value,
      description: this.editForm.get(['description']).value,
      deliverables: this.editForm.get(['deliverables']).value,
      dept: this.editForm.get(['dept']).value,
      involvedActivity: this.makeInvoled(),
      status:
        whatDo === 1
          ? 1
          : this.editForm.get(['dateClosure']).value === undefined || this.editForm.get(['dateClosure']).value === null
          ? 1
          : 0,
      dateClosure: whatDo === 1 ? null : this.editForm.get(['dateClosure']).value,
      creator: this.editForm.get(['creator']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivity>>) {
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

  clearInput(id, idForm) {
    const input = document.getElementById(id) as HTMLInputElement;
    input.value = null;
    this.editForm.patchValue({ [idForm]: null });
  }

  makeInvoled() {
    let involvedPeople = '';
    involvedPeople += `${this.involvedNames},`;
    involvedPeople = involvedPeople.slice(0, -1);
    // eslint-disable-next-line no-console
    console.log(involvedPeople);
    return involvedPeople;
  }

  searchUser(e) {
    if (e.target.value.length >= 3) {
      this.isSaving = true;
      this.userService.findByLike(e.target.value).subscribe((res: HttpResponse<IUser[]>) => this.putNames(res.body));
    } else {
      this.likeUser = [];
    }
  }

  putNames(nameVal: IUser[]) {
    this.likeUser = nameVal;
    this.isSaving = false;
  }

  uploadName(login) {
    // eslint-disable-next-line no-console
    console.log(login);

    // eslint-disable-next-line no-console
    console.log(this.involvedNames);

    for (let i = 0; i < this.involvedNames.length; i++) {
      if (this.involvedNames[i] === login) {
        this.involvedNames.splice(i, 1);
      }
    }
    this.involvedNames.push(login);
    // eslint-disable-next-line no-console
    console.log(this.involvedNames);

    this.editForm.patchValue({
      involvedActivity: ''
    });
    this.likeUser = [];
  }

  deleteInvol(pos) {
    this.involvedNames.splice(pos, 1);
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }
}
