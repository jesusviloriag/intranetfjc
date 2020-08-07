import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { IActivity, Activity } from 'app/shared/model/activity.model';
import { ActivityService } from './activity.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { JhiLanguageService } from 'ng-jhipster';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.scss']
})
export class ActivityCreateComponent implements OnInit {
  isSaving: boolean;

  account$: Observable<Account>;
  informationUser: any = {};

  modalTitle: string;
  modalMsg: string;
  modalIcon: string;
  modalbtn: string;
  showModalMsg: boolean;

  users: IUser[];
  dateStartDp: any;
  dateLimitDp: any;

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
    creator: [null]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected activityService: ActivityService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private fb: FormBuilder,
    private route: Router,
    public languageService: JhiLanguageService,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.showModalMsg = false;
    this.isSaving = false;
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });

    this.account$ = this.accountService.identity();
    this.accountService.identity().subscribe(account => {
      this.updateUser(account);
    });
  }

  updateUser(account: Account): void {
    this.informationUser = account;
    this.editForm.patchValue({
      creator: account
    });
  }

  clearInput(id, idForm) {
    const input = document.getElementById(id) as HTMLInputElement;
    input.value = null;
    this.editForm.patchValue({ [idForm]: null });
  }

  save() {
    // eslint-disable-next-line no-console
    console.log(this.editForm.value);
    if (this.editForm.valid && this.involvedNames.length > 0) {
      if (this.editForm.get('dateLimit').value !== null) {
        if (this.editForm.get('dateStart').value.isAfter(this.editForm.get('dateLimit').value)) {
          this.modalTitle = `${this.getLabel('invalid Aate', 'Fecha Inválida')}`;
          this.modalMsg = `${this.getLabel(
            'The commitment date cannot be earlier than the initial',
            'La fecha de compromiso no puede ser antes a la inicial'
          )}`;
          this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
          this.modalIcon = 'warning';
          this.showModalMsg = true;
          return 0;
        }
      }
      window.scroll(0, 0);
      this.isSaving = true;
      const activity = this.createFromForm();
      this.subscribeToSaveResponse(this.activityService.create(activity));
    } else {
      this.modalTitle = `${this.getLabel('Empty Fields', 'Campos Vacíos')}`;
      this.modalMsg = `${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`;
      this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
      this.modalIcon = 'warning';
      this.showModalMsg = true;
    }
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
      status: 1,
      dateClosure: null,
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
    this.modalTitle = `${this.getLabel('Activity Created', 'Actividad Creada')}`;
    this.modalMsg = `${this.getLabel(
      'The activity was created successfully, the users involved will be notified',
      'La actividad fue creada con éxito, se le notificara a los usuario involucrados'
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

  closeModal(e) {
    this.modalTitle = '';
    this.modalMsg = '';
    this.modalbtn = '';
    this.modalIcon = '';
    this.showModalMsg = false;
    if (e === 1) {
      this.route.navigateByUrl('/activity/records');
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
