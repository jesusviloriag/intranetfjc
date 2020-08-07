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
  selector: 'jhi-activity-modify',
  templateUrl: './activity-modify.component.html',
  styleUrls: ['./activity-modify.component.scss']
})
export class ActivityModifyComponent implements OnInit {
  isSaving: boolean;
  modalTitle: string;
  modalMsg: string;
  modalIcon: string;
  modalbtn: string;
  showModalMsg: boolean;

  users: IUser[];
  dateStartDp: any;
  dateLimitDp: any;
  dpte: any;
  activityDpte: any;

  likeUser = [];
  involvedNames = [];
  maxInvolved: any;
  editForm = this.fb.group({
    id: [],
    nameActivity: [],
    dateStart: [],
    dateLimit: [],
    description: ['', [Validators.required]],
    deliverables: ['', [Validators.required]],
    dept: [],
    involvedActivity: [''],
    status: [],
    dateClosure: [],
    creator: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected activityService: ActivityService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private route: Router,
    public languageService: JhiLanguageService,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.showModalMsg = false;
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ activity }) => {
      this.updateForm(activity);
    });
    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(activity: IActivity) {
    const arrInvolved = activity.involvedActivity.split(',');
    this.involvedNames = arrInvolved;
    this.maxInvolved = arrInvolved.length - 1;
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

    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
      this.activityDpte = this.getDepartament(activity.dept);
    });
  }

  getDepartament(idDept: any) {
    return this.dpte.find(({ id }) => id === Number(idDept));
  }

  save() {
    //this.isSaving = true;
    if (this.editForm.valid && this.involvedNames.length > 0) {
      window.scroll(0, 0);
      this.isSaving = true;
      const activity = this.createFromForm();
      this.subscribeToSaveResponse(this.activityService.update(activity));
    } else {
      this.modalTitle = `${this.getLabel('Empty Fields', 'Campos Vacíos')}`;
      this.modalMsg = `${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`;
      this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
      this.modalIcon = 'warning';
      this.showModalMsg = true;
    }
  }

  getDpteName(deptInvol) {
    let correctName = '';
    for (let i = 1; i <= this.dpte.length; i++) {
      if (this.dpte[i - 1].id === Number(deptInvol)) {
        correctName = this.dpte[i - 1].name;
      }
    }
    return correctName;
  }

  private createFromForm(): IActivity {
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
      status: Number(this.editForm.get(['status']).value),
      dateClosure: this.editForm.get(['dateClosure']).value,
      creator: this.editForm.get(['creator']).value
    };
  }

  makeInvoled() {
    let involvedPeople = '';
    involvedPeople += `${this.involvedNames},`;
    involvedPeople = involvedPeople.slice(0, -1);
    // eslint-disable-next-line no-console
    console.log(involvedPeople);
    return involvedPeople;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivity>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.modalTitle = `${this.getLabel('Successful Modification', 'Modificación Exitosa')}`;
    this.modalMsg = `${this.getLabel(
      'The data was successfully changed. All involved will be notifiedof this activity',
      'Los datos fueron cambiados con exito. Serán notificados todos los involucrados de esta actividad'
    )}`;
    this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
    this.modalIcon = 'confirm';
    this.showModalMsg = true;
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  putDateReal(e) {
    // eslint-disable-next-line no-console
    console.log(e.target.value);
    if (e.target.value === '1') {
      this.editForm.patchValue({
        dateClosure: null
      });
    } else {
      this.editForm.patchValue({
        dateClosure: moment()
      });
    }

    // eslint-disable-next-line no-console
    console.log(this.editForm.get('dateClosure').value);
  }

  clearInput(id, idForm) {
    const input = document.getElementById(id) as HTMLInputElement;
    input.value = null;
    this.editForm.patchValue({ [idForm]: null });
  }

  closeModal(e) {
    this.modalTitle = '';
    this.modalMsg = '';
    this.modalbtn = '';
    this.modalIcon = '';
    this.showModalMsg = false;
    if (e === 1) {
      this.route.navigateByUrl('/menu');
    }
    // eslint-disable-next-line no-console
    console.log(e);
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
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
}
