import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IFinding, Finding } from 'app/shared/model/finding.model';
import { FindingService } from './finding.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-finding-update',
  templateUrl: './finding-update.component.html',
  styleUrls: ['./finding-update.component.scss']
})
export class FindingUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];
  dateStartDp: any;
  dateEndDp: any;
  dateClosureDp: any;
  dpte: any;

  findingCode: any;

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
    typeFinding: [null],
    deptInvol: [],
    identificationCause: [],
    correctiveAct: [],
    actionDesc: [],
    creator: [null, Validators.required]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected findingService: FindingService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private route: Router,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.isSaving = true;
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IFinding[]>) => (this.dpte = res.body));
    this.activatedRoute.data.subscribe(({ finding }) => {
      this.updateForm(finding);
      this.generateCode();
    });
    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(finding: IFinding) {
    this.editForm.patchValue({
      id: finding.id,
      codFinding: finding.codFinding,
      dateStart: finding.dateStart,
      dateEnd: finding.dateEnd,
      dateClosure: finding.dateClosure,
      description: finding.description,
      evidence: finding.evidence,
      methodology: finding.methodology,
      linkDoc: finding.linkDoc,
      linkDocContentType: finding.linkDocContentType,
      descHow: finding.descHow,
      typeFinding: finding.typeFinding,
      deptInvol: finding.deptInvol,
      identificationCause: finding.identificationCause,
      correctiveAct: finding.correctiveAct,
      actionDesc: finding.actionDesc,
      creator: finding.creator
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
    const finding = this.createFromForm();
    if (finding.id !== undefined) {
      this.subscribeToSaveResponse(this.findingService.update(finding));
    } else {
      this.subscribeToSaveResponse(this.findingService.create(finding));
    }
  }

  private createFromForm(): IFinding {
    return {
      ...new Finding(),
      id: this.editForm.get(['id']).value,
      codFinding: this.findingCode,
      dateStart: this.editForm.get(['dateStart']).value,
      dateEnd: this.editForm.get(['dateEnd']).value,
      dateClosure: this.editForm.get(['dateClosure']).value,
      description: this.editForm.get(['description']).value,
      evidence: this.editForm.get(['evidence']).value,
      methodology: this.editForm.get(['methodology']).value,
      linkDocContentType: this.editForm.get(['linkDocContentType']).value,
      linkDoc: this.editForm.get(['linkDoc']).value,
      descHow: this.editForm.get(['descHow']).value,
      typeFinding: this.editForm.get(['typeFinding']).value,
      deptInvol: this.editForm.get(['deptInvol']).value,
      identificationCause: this.editForm.get(['identificationCause']).value,
      correctiveAct: this.editForm.get(['correctiveAct']).value,
      actionDesc: this.editForm.get(['actionDesc']).value,
      creator: this.editForm.get(['creator']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinding>>) {
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

  private generateCode() {
    let code = '';
    if (Number(this.editForm.get('typeFinding').value) === 1 || Number(this.editForm.get('typeFinding').value) === 0) {
      code += Number(this.editForm.get('typeFinding').value) === 1 ? 'RM-' : 'RA-';
    }
    if (this.editForm.get('deptInvol').value !== '' && this.editForm.get('deptInvol').value !== null) {
      switch (Number(this.editForm.get('deptInvol').value)) {
        case 1:
          code += 'UDM';
          break;
        case 2:
          code += 'UEI';
          break;
        case 3:
          code += 'SGE';
          break;
        case 4:
          code += 'ADM';
          break;
        case 5:
          code += 'THU';
          break;
        case 6:
          code += 'COM';
          break;
        case 7:
          code += 'DON';
          break;
        case 8:
          code += 'PRE';
          break;
        case 9:
          code += 'SEG';
          break;
        case 10:
          code += 'SGC';
          break;
      }
      code += '-';
    }
    if (this.editForm.get('dateStart').value !== '' && this.editForm.get('dateStart').value !== null) {
      code += this.editForm.get('dateStart').value.format('YY') + '-';
    }
    this.findingCode = `${code}`;
  }
}
