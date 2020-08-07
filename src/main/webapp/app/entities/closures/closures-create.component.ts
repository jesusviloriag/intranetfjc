import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormArray } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { IFinding } from 'app/shared/model/finding.model';
import { IClosures, Closures } from 'app/shared/model/closures.model';
import { ClosuresService } from 'app/entities/closures/closures.service';
import { UserService } from 'app/core/user/user.service';
import { IUser } from 'app/core/user/user.model';
import { FindingService } from 'app/entities/finding/finding.service';
import { Observable } from 'rxjs';
import { JhiLanguageService } from 'ng-jhipster';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-closures-create',
  templateUrl: './closures-create.component.html',
  styleUrls: ['./closures-create.component.scss']
})
export class ClosuresCreateComponent implements OnInit {
  isSaving: boolean;
  finding: IFinding;
  user: IUser[];
  dateStartDp: any;
  dateEndDp: any;
  id: any;
  dpte: any;
  modalTitle: string;
  modalMsg: string;
  modalIcon: string;
  modalbtn: string;
  showModalMsg: boolean;

  departament: any;
  account$: Observable<Account>;

  closureForm = this.fb.group({
    id: [undefined],
    stateClosure: [null],
    actionClosed: [0, [Validators.required]],
    effectiveness: [0],
    dept: [],
    dateClosure: [null],
    improveComment: [null, [Validators.required]],
    effectivenessComment: [null],
    findClose: [null]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    private location: Location,
    protected findingService: FindingService,
    protected userService: UserService,
    protected fb: FormBuilder,
    protected closuresService: ClosuresService,
    public languageService: JhiLanguageService,
    private accountService: AccountService,
    protected route: Router
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id1');
      this.findingService.find(this.id).subscribe((res: HttpResponse<IFinding>) => this.getFindingById(res.body));
    });
    this.closureForm.patchValue({
      dateClosure: moment().format('DD/MM/YY')
    });
    this.account$ = this.accountService.identity();
    this.accountService.identity().subscribe(account => {
      this.departament = account.departaments[0];
    });
    this.closureForm.patchValue({
      dept: this.departament.nameDepartament
    });
  }

  getFindingById(data: IFinding) {
    this.finding = data;
  }

  save() {
    if (this.closureForm.valid) {
      if (this.closureForm.get('actionClosed').value === 0) {
        this.modalTitle = `${this.getLabel('Empty Fields', 'Campos Vacíos')}`;
        this.modalMsg = `${this.getLabel(
          'The field "Did the actions be closed?" required a selected option',
          'El campo "Las acciones fueron cerradas?" requiere una opcion seleccionada'
        )}`;
        this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
        this.modalIcon = 'warning';
        this.showModalMsg = true;
        return 0;
      }
    } else {
      this.modalTitle = `${this.getLabel('Empty Fields', 'Campos Vacíos')}`;
      this.modalMsg = `${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`;
      this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
      this.modalIcon = 'warning';
      this.showModalMsg = true;
      return 0;
    }
    this.isSaving = true;
    this.closureForm.patchValue({
      stateClosure: 'Cerrado',
      effectiveness: 0
    });
    const formValues = this.closureForm;
    // eslint-disable-next-line no-console
    console.log(formValues);
    const closure = this.createFromFormClosure();
    this.subscribeToSaveResponseClosure(this.closuresService.create(closure));
    this.finding.dateClosure = moment();
    this.subscribeToUpdateResponseFinding(this.findingService.update(this.finding));
  }

  protected createFromFormClosure(): IClosures {
    return {
      ...new Closures(),
      id: undefined,
      stateClosure: this.closureForm.get('stateClosure').value,
      actionClosed: this.closureForm.get('actionClosed').value,
      effectiveness: this.closureForm.get('effectiveness').value,
      dept: this.departament.id,
      improveComment: this.closureForm.get('improveComment').value,
      effectivenessComment: this.closureForm.get('effectivenessComment').value,
      findClose: this.finding
    };
  }

  protected subscribeToUpdateResponseFinding(result: Observable<HttpResponse<IFinding>>) {
    result.subscribe(() => this.onUpdateSuccess(), () => this.onUpdateError());
  }
  protected onUpdateSuccess() {
    // eslint-disable-next-line no-console
    console.log('LAS DROGAS SON BUENAS y yo actualizo A finding');
    this.isSaving = false;
    this.modalTitle = `${this.getLabel('Closure created', 'Cierre creado')}`;
    this.modalMsg = `${this.getLabel(
      'Closure successfully created, it will be available for its verification',
      'Cierre de hallazgo creado correctamente, el cierre estará disponible para su verificación'
    )}`;
    this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
    this.modalIcon = 'confirm';
    this.showModalMsg = true;
  }

  protected onUpdateError() {
    // eslint-disable-next-line no-console
    console.log('LAS DROGAS SON MALAS y yo no actualize a finding');
    this.isSaving = false;
  }

  protected subscribeToSaveResponseClosure(result: Observable<HttpResponse<IClosures>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    // eslint-disable-next-line no-console
    console.log('LAS DROGAS SON BUENAS');
  }

  protected onSaveError() {
    // eslint-disable-next-line no-console
    console.log('LAS DROGAS SON MALAS');
    this.isSaving = false;
  }

  navigateBack() {
    this.location.back();
  }

  previousState() {
    window.history.back();
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
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
}
