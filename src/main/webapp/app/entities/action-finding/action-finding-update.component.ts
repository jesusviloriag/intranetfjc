import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IActionFinding, ActionFinding } from 'app/shared/model/action-finding.model';
import { ActionFindingService } from './action-finding.service';
import { IFinding } from 'app/shared/model/finding.model';
import { FindingService } from 'app/entities/finding/finding.service';
import { UserService } from 'app/core/user/user.service';
import { JhiLanguageService } from 'ng-jhipster';
import { IUser } from 'app/core/user/user.model';

@Component({
  selector: 'jhi-action-finding-update',
  templateUrl: './action-finding-update.component.html',
  styleUrls: ['./action-finding-update.component.scss']
})
export class ActionFindingUpdateComponent implements OnInit {
  isSaving: boolean;

  findings: IFinding[];
  dateStartActionDp: any;
  dateCommitDp: any;
  dateRealCommitDp: any;

  likeUser = [];
  involvedNames = [];

  editForm = this.fb.group({
    id: [],
    descAction: [null, [Validators.required]],
    dateStartAction: [null, [Validators.required]],
    dateCommit: [null, [Validators.required]],
    dateRealCommit: [null],
    descHow: [null],
    involved: [null],
    status: [1],
    evidenceDoc: [null],
    evidenceDocContentType: [],
    observation: [],
    actFinding: [null, Validators.required]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected actionFindingService: ActionFindingService,
    protected findingService: FindingService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    protected userService: UserService,
    public languageService: JhiLanguageService
  ) {}

  ngOnInit() {
    this.isSaving = true;
    this.activatedRoute.data.subscribe(({ actionFinding }) => {
      this.updateForm(actionFinding);
    });
    this.findingService
      .query()
      .subscribe((res: HttpResponse<IFinding[]>) => (this.findings = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(actionFinding: IActionFinding) {
    if (actionFinding.id !== undefined) {
      const arrInvolved = actionFinding.involved.split(',');
      this.involvedNames = arrInvolved;
    }
    this.editForm.patchValue({
      id: actionFinding.id,
      descAction: actionFinding.descAction,
      dateStartAction: actionFinding.dateStartAction,
      dateCommit: actionFinding.dateCommit,
      dateRealCommit: actionFinding.dateRealCommit,
      descHow: actionFinding.descHow,
      involved: actionFinding.involved,
      status: actionFinding.status,
      evidenceDoc: actionFinding.evidenceDoc,
      evidenceDocContentType: actionFinding.evidenceDocContentType,
      observation: actionFinding.observation,
      actFinding: actionFinding.actFinding
    });
    this.isSaving = false;
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
    // 1 = CREANDO; 0 = ACTUALIZANDO
    if (this.editForm.get(['id']).value !== undefined) {
      if (this.editForm.valid && this.involvedNames.length > 0) {
        if (this.editForm.get('dateCommit').value !== null) {
          if (this.editForm.get('dateStartAction').value.isAfter(this.editForm.get('dateCommit').value)) {
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
        const actionFinding = this.createFromForm(0);
        this.subscribeToSaveResponse(this.actionFindingService.update(actionFinding));
      } else {
        this.isSaving = false;
        alert(`${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`);
      }
    } else {
      if (this.editForm.valid && this.involvedNames.length > 0) {
        if (this.editForm.get('dateCommit').value !== null) {
          if (this.editForm.get('dateStartAction').value.isAfter(this.editForm.get('dateCommit').value)) {
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
        const actionFinding = this.createFromForm(1);
        this.subscribeToSaveResponse(this.actionFindingService.create(actionFinding));
      } else {
        this.isSaving = false;
        alert(`${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`);
      }
    }
  }

  private createFromForm(whatDo: number): IActionFinding {
    return {
      ...new ActionFinding(),
      id: this.editForm.get(['id']).value,
      descAction: this.editForm.get(['descAction']).value,
      dateStartAction: this.editForm.get(['dateStartAction']).value,
      dateCommit: this.editForm.get(['dateCommit']).value,
      dateRealCommit: this.editForm.get(['dateRealCommit']).value,
      descHow: this.editForm.get(['descHow']).value,
      involved: this.makeInvoled(),
      status:
        whatDo === 1
          ? 1
          : this.editForm.get(['dateRealCommit']).value === undefined || this.editForm.get(['dateRealCommit']).value === null
          ? 1
          : 0,
      evidenceDocContentType: this.editForm.get(['evidenceDocContentType']).value,
      evidenceDoc: this.editForm.get(['evidenceDoc']).value,
      observation: this.editForm.get(['observation']).value,
      actFinding: this.editForm.get(['actFinding']).value
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActionFinding>>) {
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

  trackFindingById(index: number, item: IFinding) {
    return item.id;
  }

  clearInput(id, idForm) {
    const input = document.getElementById(id) as HTMLInputElement;
    input.value = null;
    this.editForm.patchValue({ [idForm]: null });
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
    for (let i = 0; i < this.involvedNames.length; i++) {
      if (this.involvedNames[i] === login) {
        this.involvedNames.splice(i, 1);
      }
    }
    this.involvedNames.push(login);
    // eslint-disable-next-line no-console
    console.log(this.involvedNames);

    this.editForm.patchValue({
      involved: ''
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
