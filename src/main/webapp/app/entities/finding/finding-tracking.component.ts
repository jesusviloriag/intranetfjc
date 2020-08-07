import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IFinding } from 'app/shared/model/finding.model';
import { FindingService } from './finding.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { Location } from '@angular/common';
import { IActionFinding, ActionFinding } from 'app/shared/model/action-finding.model';
import { JhiLanguageService } from 'ng-jhipster';
import { ActionFindingService } from 'app/entities/action-finding/action-finding.service';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'jhi-finding-tracking',
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      transition('rotated => default', animate('400ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ]),
    trigger('slideAnimation', [
      transition(':enter', [style({ height: 0, opacity: 1 }), animate('0.5s ease-out', style({ height: '*', opacity: 1 }))]),
      transition(':leave', [style({ height: '*', opacity: 1 }), animate('0.5s ease-in', style({ height: 0, opacity: 0 }))])
    ])
  ],
  templateUrl: './finding-tracking.component.html',
  styleUrls: ['./finding-tracking.component.scss']
})
export class FindingTrackingComponent implements OnInit {
  modalTitle: string;
  modalMsg: string;
  modalIcon: string;
  modalbtn: string;
  showModalMsg: boolean;

  actionFindings: any;
  actionSaved = 0;
  isSaving: boolean;
  closeDate: string;
  findingDept: any;

  users: IUser[];
  dateStartDp: any;
  dateEndDp: any;
  dateClosureDp: any;
  actions: number[] = [];
  findingId: IFinding;
  isReadOnly;

  dpte: any;
  editForm = this.fb.group({
    id: [],
    codFinding: [null, [Validators.required]],
    dateStart: [],
    dateEnd: [],
    dateClosure: [],
    description: [],
    evidence: [],
    methodology: [],
    linkDoc: [],
    linkDocContentType: [],
    descHow: [],
    typeFinding: [],
    deptInvol: [],
    identificationCause: [],
    correctiveAct: [],
    actionDesc: [],
    creator: [null, Validators.required],
    actions: this.fb.array([])
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected findingService: FindingService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    protected actionFindingService: ActionFindingService,
    private route: Router,
    public languageService: JhiLanguageService,
    public translate: TranslateService,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.showModalMsg = false;

    this.activatedRoute.data.subscribe(({ finding }) => {
      this.updateForm(finding);
      this.findingId = finding;
      this.actionFindingService.findByRel(finding.id).subscribe((res: HttpResponse<IActionFinding[]>) => this.getActionFindings(res.body));
    });

    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.editForm.patchValue({
        dateClosure:
          this.editForm.get('dateClosure').value === 'Sin concluir' || this.editForm.get('dateClosure').value === 'Unfinished'
            ? this.getLabel('Unfinished', 'Sin concluir')
            : this.editForm.get('dateClosure').value
      });
    });
  }

  navigateBack() {
    this.location.back();
  }

  addOtherActionsFormGroup(data): FormGroup {
    this.closeDate = data.dateRealCommit == null ? 'Sin concluir' : data.dateRealCommit.format('DD-MM-YYYY');
    return this.fb.group({
      state: 'default',
      showAction: false,
      id: data.id,
      status: data.status,
      descAction: data.descAction,
      dateStartAction: data.dateStartAction,
      dateCommit: data.dateCommit,
      dateRealCommit: data.dateRealCommit == null ? 'Sin concluir' : data.dateRealCommit,
      descHow: data.descHow,
      involved: data.involved,
      evidenceDoc: data.evidenceDoc,
      evidenceDocContentType: data.evidenceDocContentType,
      observation: data.observation
    });
  }

  updateForm(finding: IFinding) {
    this.editForm.patchValue({
      id: finding.id,
      codFinding: finding.codFinding + finding.id,
      dateStart: finding.dateStart.format('DD-MM-YYYY'),
      dateEnd: finding.dateEnd.format('DD-MM-YYYY'),
      dateClosure: finding.dateClosure == null ? this.getLabel('Unfinished', 'Sin concluir') : finding.dateClosure,
      description: finding.description,
      evidence: finding.evidence,
      methodology: finding.methodology,
      linkDoc: finding.linkDoc == null ? null : finding.linkDoc,
      linkDocContentType: finding.linkDocContentType,
      descHow: finding.descHow,
      typeFinding: finding.typeFinding,
      deptInvol: finding.deptInvol,
      identificationCause: finding.identificationCause,
      correctiveAct: finding.correctiveAct,
      actionDesc: finding.actionDesc,
      creator: finding.creator.firstName
    });

    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
      this.findingDept = this.getDepartament(finding.deptInvol);
    });
  }

  getDepartament(idDept: any) {
    return this.dpte.find(({ id }) => id === Number(idDept));
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage, i) {
    const actions = this.editForm.get('actions') as FormArray;
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file: File = event.target.files[0];
        if (isImage && !file.type.startsWith('image/')) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            actions.controls[i].patchValue({
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
    const actionForm = this.editForm.get('actions').value as FormArray;
    const actions = [];
    this.isSaving = true;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    window.scroll(0, 0);
    for (let i = 0; i < actionForm.length; i++) {
      actions[i] = this.createFromFormAction(actionForm[i]);
      // eslint-disable-next-line no-console
      console.log(actions[i]);
      this.subscribeToSaveResponseActions(this.actionFindingService.update(actions[i]));
    }
  }

  private createFromFormAction(values: any): IActionFinding {
    return {
      ...new ActionFinding(),
      id: values.id,
      descAction: values.descAction,
      dateStartAction: values.dateStartAction,
      dateCommit: values.dateCommit,
      dateRealCommit: values.dateRealCommit === 'Sin concluir' ? null : moment(values.dateRealCommit),
      descHow: values.descHow,
      involved: values.involved,
      status: values.status,
      evidenceDoc: values.evidenceDoc,
      evidenceDocContentType: values.evidenceDocContentType,
      observation: values.observation,
      actFinding: this.findingId
    };
  }

  protected subscribeToSaveResponseActions(result: Observable<HttpResponse<IFinding>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected getActionFindings(data: IActionFinding[]) {
    this.actionFindings = data;
    // eslint-disable-next-line no-console
    console.log(this.actionFindings[0]);
    for (let i = 0; i < this.actionFindings.length; i++) {
      this.actionSaved++;
      (this.editForm.get('actions') as FormArray).push(this.addOtherActionsFormGroup(this.actionFindings[i]));
    }
  }

  protected onSaveSuccess() {
    this.actionSaved--;
    if (this.actionSaved === 0) {
      this.isSaving = false;
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
      const msgEs = `La información de la ${
        this.editForm.get('typeFinding').value === '1' ? 'oportunidad de mejora' : 'no conformidad'
      } fue modificada con éxito`;
      const msgEn = `The information of the ${
        this.editForm.get('typeFinding').value === '1' ? 'opportunity for improvement' : 'nonconformity'
      } was successfully modified`;
      this.modalTitle = `${this.getLabel('Successful Modification ', 'Modificación Exitosa')}`;
      this.modalMsg = `${this.getLabel(msgEn, msgEs)}`;
      this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
      this.modalIcon = 'confirm';
      this.showModalMsg = true;
    }
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

  protected onSaveError() {}

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  showAction(index: number, currentState: boolean) {
    const actions = this.editForm.get('actions') as FormArray;

    actions.controls[index].patchValue({
      showAction: !currentState,
      state: !currentState ? 'rotated' : 'default'
    });

    for (let i = 0; i < actions.controls.length; i++) {
      if (i !== index) {
        actions.controls[i].patchValue({
          showAction: false,
          state: 'default'
        });
      }
    }
    this.isReadOnly = actions.controls[index].get('status').value === 0 ? true : false;
  }

  putDateNow(index) {
    const actions = this.editForm.get('actions') as FormArray;
    if (parseInt(actions.controls[index].get('status').value, 0) === 0) {
      this.closeDate = moment().format('DD-MM-YYYY');
      actions.controls[index].patchValue({
        dateRealCommit: moment().format('YYYY-MM-DD')
      });
    } else {
      this.closeDate = 'Sin concluir';
      actions.controls[index].patchValue({
        dateRealCommit: 'Sin concluir'
      });
    }
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }
}
