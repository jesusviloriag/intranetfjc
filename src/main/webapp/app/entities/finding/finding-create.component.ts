import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IFinding, Finding } from 'app/shared/model/finding.model';
import { FindingService } from './finding.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IActionFinding, ActionFinding } from 'app/shared/model/action-finding.model';
import { ActionFindingService } from '../action-finding/action-finding.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { JhiLanguageService } from 'ng-jhipster';
import { DepartamentService } from '../departament/departament.service';

@Component({
  selector: 'jhi-finding-create',
  templateUrl: './finding-create.component.html',
  styleUrls: ['./finding-create.component.scss']
})
export class FindingCreateComponent implements OnInit {
  isSaving: boolean;

  modalTitle: string;
  modalMsg: string;
  modalIcon: string;
  modalbtn: string;
  showModalMsg: boolean;

  dpte: any;
  account$: Observable<Account>;
  informationUser: any = {};
  actions: number[] = [];

  users: IUser[];
  dateStartDp: any;
  dateEndDp: any;
  dateClosureDp: any;

  findings: IFinding[];
  findingId: IFinding[];
  dateStartActionDp: any;
  dateCommitDp: any;

  likeUser = [];
  involvedNames = [];
  editForm = this.fb.group({
    id: [],
    codFinding: [null, [Validators.required]],
    dateStart: [null, [Validators.required]],
    dateEnd: [null, [Validators.required]],
    dateClosure: [],
    description: [null, [Validators.required]],
    evidence: [null, [Validators.required]],
    methodology: [null, [Validators.required]],
    methodologyOther: [null, []],
    linkDoc: [null, [Validators.required]],
    linkDocContentType: [null, [Validators.required]],
    descHow: [null, [Validators.required]],
    typeFinding: [],
    deptInvol: [null, [Validators.required]],
    identificationCause: [null, [Validators.required]],
    correctiveAct: [null, [Validators.required]],
    actionDesc: [null, [Validators.required]],
    creator: [null],
    actions: this.fb.array([this.addOtherActionsFormGroup()])
  });

  actionSaved = 0;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected findingService: FindingService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private location: Location,
    protected actionFindingService: ActionFindingService,
    private fb: FormBuilder,
    private accountService: AccountService,
    public languageService: JhiLanguageService,
    private route: Router,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.showModalMsg = false;
    this.isSaving = false;
    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));

    this.account$ = this.accountService.identity();
    this.accountService.identity().subscribe(account => {
      this.updateUser(account);
    });

    this.dpteService.findAll('all').subscribe((res: HttpResponse<IFinding[]>) => (this.dpte = res.body));

    this.involvedNames[this.involvedNames.length] = [];
    this.actionSaved++;
    this.actions.push(0);
  }

  addOtherActionsFormGroup(): FormGroup {
    return this.fb.group({
      descAction: [null, [Validators.required]],
      dateStartAction: [null, [Validators.required]],
      dateCommit: [null, [Validators.required]],
      involved: [null]
    });
  }

  addAction(): void {
    this.involvedNames[this.involvedNames.length] = [];
    this.actions.push(this.actions.length);
    this.actionSaved++;
    (this.editForm.get('actions') as FormArray).push(this.addOtherActionsFormGroup());
  }

  removeAction(): void {
    if (this.actions.length > 1) {
      this.involvedNames.pop();
      this.actions.pop();
      this.actionSaved--;
      (this.editForm.get('actions') as FormArray).removeAt(this.actions.length);
    }
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

  save() {
    // eslint-disable-next-line no-console
    console.log(this.involvedNames);
    if (this.editForm.valid) {
      if (this.editForm.get('methodology').value === 'Otro') {
        if (this.editForm.get('methodologyOther').value === '' || this.editForm.get('methodologyOther').value === null) {
          this.modalTitle = `${this.getLabel('Empty Fields', 'Campos Vacíos')}`;
          this.modalMsg = `${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`;
          this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
          this.modalIcon = 'warning';
          this.showModalMsg = true;
          return 0;
        }
      }
      if (this.editForm.get('dateStart').value.isAfter(this.editForm.get('dateEnd').value)) {
        //   Validar que la fecha de inicio sea menor a la final
        this.modalTitle = `${this.getLabel('Invalid Date', 'Fecha Inválida')}`;
        this.modalMsg = `${this.getLabel(
          'The commitment date cannot be before the initial',
          'La fecha de compromiso no puede ser antes a la inicial'
        )}`;
        this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
        this.modalIcon = 'warning';
        this.showModalMsg = true;
      } else {
        const actionForm = this.editForm.get('actions').value as FormArray;
        let datesInitial = 0;
        let datesCommit = 0;
        let datesAction = 0;
        for (let i = 0; i < actionForm.length; i++) {
          //  Validar que ninguna accion empiece antes del hallazgo
          if (this.editForm.get('dateStart').value.isAfter(actionForm[i].dateStartAction)) {
            datesInitial++;
          }
          //  Validar que ninguna fecha final de una accion sea mayor a la del hallazgo
          if (this.editForm.get('dateEnd').value.isBefore(actionForm[i].dateCommit)) {
            datesCommit++;
          }
          //  Validar las fechas de las acciones
          if (actionForm[i].dateStartAction.isAfter(actionForm[i].dateCommit)) {
            datesAction++;
          }
          //COLOCAR UN MENSAJE mejor
          if (this.involvedNames[i].length < 1) {
            this.modalTitle = `${this.getLabel('Involved empty', 'Involucrados vacíos')}`;
            this.modalMsg = `${this.getLabel(
              'There must be at least 1 involved in the actions',
              'Debe haber almenos 1 involucrado en las acciones'
            )}`;
            this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
            this.modalIcon = 'warning';
            this.showModalMsg = true;
            return 0;
          }
        }
        if (datesInitial > 0) {
          this.modalTitle = `${this.getLabel('Invalid Date', 'Fecha Inválida')}`;
          this.modalMsg = `${this.getLabel(
            'The start dates of the actions cannot be earlier than the initial date of the finding',
            'Las fechas de inicio de las acciones no pueden ser antes a la fecha inicial del hallazgo'
          )}`;
          this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
          this.modalIcon = 'warning';
          this.showModalMsg = true;
        } else if (datesCommit > 0) {
          this.modalTitle = `${this.getLabel('Invalid Date', 'Fecha Inválida')}`;
          this.modalMsg = `${this.getLabel(
            'Action commitment dates cannot be after the finding commitment date',
            'Las fechas de compromiso de las acciones no pueden ser despues de la fecha de compromiso del hallazgo'
          )}`;
          this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
          this.modalIcon = 'warning';
          this.showModalMsg = true;
        } else if (datesAction > 0) {
          this.modalTitle = `${this.getLabel('Invalid Date', 'Fecha Inválida')}`;
          this.modalMsg = `${this.getLabel('The dates of the actions are incorrect', 'Las fechas de las acciones son incorrectas')}`;
          this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
          this.modalIcon = 'warning';
          this.showModalMsg = true;
        } else {
          this.isSaving = true;
          document.getElementsByTagName('body')[0].style.overflow = 'hidden';
          window.scroll(0, 0);
          const formValues = this.editForm;
          // eslint-disable-next-line no-console
          console.log(formValues);
          const finding = this.createFromFormFind();
          this.subscribeToSaveResponseFinding(this.findingService.create(finding));
        }
      }
    } else {
      this.modalTitle = `${this.getLabel('Empty Fields', 'Campos Vacíos')}`;
      this.modalMsg = `${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`;
      this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
      this.modalIcon = 'warning';
      this.showModalMsg = true;
    }
  }

  protected subscribeToSaveResponseFinding(result: Observable<HttpResponse<IFinding>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.loadAll();
  }

  loadAll() {
    this.findingService
      .query({
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IFinding[]>) => this.getFindings(res.body));
  }

  protected getFindings(data: IFinding[]) {
    this.findingId = data;
    const actionForm = this.editForm.get('actions').value as FormArray;
    const actions = [];
    for (let i = 0; i < actionForm.length; i++) {
      actions[i] = this.createFromFormAction(actionForm[i], i);
    }
    this.recursiveSaving(actions, 0);
  }

  protected recursiveSaving(actions, index) {
    this.subscribeToSaveResponseActions(this.actionFindingService.create(actions[index]), actions, index);
  }

  protected subscribeToSaveResponseActions(result: Observable<HttpResponse<IActionFinding>>, actions, index) {
    result.subscribe(() => this.onSaveSuccessGoOut(actions, index), () => this.onSaveError());
  }

  protected onSaveSuccessGoOut(actions, index) {
    this.actionSaved--;
    index++;
    if (this.actionSaved === 0) {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
      this.isSaving = false;
      const titleEs = `${this.editForm.get('typeFinding').value === '1' ? 'Oportunidad de mejora' : 'No conformidad'} creada`;
      const titleEn = `${this.editForm.get('typeFinding').value === '1' ? 'Opportunity for improvement' : 'Nonconformity'} created`;

      const msgEs = `La ${
        this.editForm.get('typeFinding').value === '1' ? 'oportunidad de mejora' : 'no conformidad'
      } fue creada con exito, será notificado a los usuarios involucrados`;
      const msgEn = `The ${
        this.editForm.get('typeFinding').value === '1' ? 'opportunity for improvement' : 'nonconformity'
      } was created successfully, the involved users will be notified`;
      this.modalTitle = `${this.getLabel(titleEn, titleEs)}`;
      this.modalMsg = `${this.getLabel(msgEn, msgEs)}`;
      this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
      this.modalIcon = 'confirm';
      this.showModalMsg = true;
    } else {
      this.recursiveSaving(actions, index);
    }
  }

  sort() {
    const result = ['id,' + 'desc'];
    result.push('id');
    return result;
  }

  protected onSaveError() {
    this.isSaving = false;
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
    // eslint-disable-next-line no-console
    console.log('errores');
  }

  private createFromFormFind(): IFinding {
    return {
      ...new Finding(),
      id: undefined,
      codFinding: this.editForm.get(['codFinding']).value,
      dateStart: this.editForm.get(['dateStart']).value,
      dateEnd: this.editForm.get(['dateEnd']).value,
      dateClosure: null,
      description: this.editForm.get(['description']).value,
      evidence: this.editForm.get(['evidence']).value,
      methodology:
        this.editForm.get(['methodology']).value === 'Otro'
          ? this.editForm.get(['methodologyOther']).value
          : this.editForm.get(['methodology']).value,
      linkDocContentType: this.editForm.get(['linkDocContentType']).value,
      linkDoc: this.editForm.get(['linkDoc']).value,
      descHow: this.editForm.get(['descHow']).value,
      typeFinding: this.editForm.get(['typeFinding']).value,
      deptInvol: this.editForm.get(['deptInvol']).value,
      identificationCause: this.editForm.get(['identificationCause']).value,
      correctiveAct: this.editForm.get(['correctiveAct']).value,
      actionDesc: this.editForm.get(['actionDesc']).value,
      creator: this.informationUser
    };
  }

  private createFromFormAction(values: any, pos: number): IActionFinding {
    return {
      ...new ActionFinding(),
      id: undefined,
      descAction: values.descAction,
      dateStartAction: values.dateStartAction,
      dateCommit: values.dateCommit,
      dateRealCommit: null,
      descHow: null,
      involved: this.makeInvoled(pos),
      status: 1,
      evidenceDoc: null,
      evidenceDocContentType: null,
      observation: null,
      actFinding: this.findingId[0]
    };
  }

  makeInvoled(pos) {
    let involvedPeople = '';
    involvedPeople += `${this.involvedNames[pos]},`;
    involvedPeople = involvedPeople.slice(0, -1);
    // eslint-disable-next-line no-console
    console.log(involvedPeople);
    return involvedPeople;
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  private generateCode() {
    let code = '';
    if (this.editForm.get('typeFinding').value === '1' || this.editForm.get('typeFinding').value === '0') {
      code += this.editForm.get('typeFinding').value === '1' ? 'RM-' : 'RA-';
    }
    if (this.editForm.get('deptInvol').value !== '' && this.editForm.get('deptInvol').value !== null) {
      switch (this.editForm.get('deptInvol').value) {
        case '1':
          code += 'UDM';
          break;
        case '2':
          code += 'UEI';
          break;
        case '3':
          code += 'SGE';
          break;
        case '4':
          code += 'ADM';
          break;
        case '5':
          code += 'THU';
          break;
        case '6':
          code += 'COM';
          break;
        case '7':
          code += 'DON';
          break;
        case '8':
          code += 'PRE';
          break;
        case '9':
          code += 'SEG';
          break;
        case '10':
          code += 'SGC';
          break;
      }
      code += '-';
    }
    if (this.editForm.get('dateStart').value !== '' && this.editForm.get('dateStart').value !== null) {
      code += this.editForm.get('dateStart').value.format('YY') + '-';
    }
    this.editForm.get('codFinding').setValue(code);
  }

  updateUser(account: Account): void {
    this.informationUser = account;
  }

  closeModal(e) {
    this.modalTitle = '';
    this.modalMsg = '';
    this.modalbtn = '';
    this.modalIcon = '';
    this.showModalMsg = false;
    if (e === 1) {
      this.route.navigateByUrl('/finding/records');
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

  uploadName(login, j) {
    for (let i = 0; i < this.involvedNames[j].length; i++) {
      if (this.involvedNames[j][i] === login) {
        this.involvedNames[j].splice(i, 1);
      }
    }
    this.involvedNames[j].push(login);
    // eslint-disable-next-line no-console
    console.log(this.involvedNames);
    const actions = this.editForm.get('actions') as FormArray;
    // eslint-disable-next-line no-console
    console.log(actions);

    /*actions[j].patchValue({
      involved: "",
    });*/

    // eslint-disable-next-line no-alert
    actions.at(j).patchValue({ involved: '' });
    this.likeUser = [];
  }

  deleteInvol(pos) {
    this.involvedNames.splice(pos, 1);
  }
}
