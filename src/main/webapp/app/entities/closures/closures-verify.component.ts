import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { IClosures, Closures } from 'app/shared/model/closures.model';
import { ClosuresService } from './closures.service';
import { IFinding } from 'app/shared/model/finding.model';
import { FindingService } from 'app/entities/finding/finding.service';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-closures-verify',
  templateUrl: './closures-verify.component.html',
  styleUrls: ['./closures-verify.component.scss']
})
export class ClosuresVerifyComponent implements OnInit {
  isSaving: boolean;

  findcloses: IFinding[];
  finding: any;
  departament: any;
  dpte: any;

  editForm = this.fb.group({
    id: [],
    stateClosure: [],
    actionClosed: [],
    effectiveness: ['', [Validators.required]],
    dept: [],
    improveComment: [],
    effectivenessComment: ['', [Validators.required]],
    findClose: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected closuresService: ClosuresService,
    protected findingService: FindingService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.isSaving = true;
    this.activatedRoute.data.subscribe(({ closures }) => {
      this.updateForm(closures);
      this.findingService.find(closures.findClose.id).subscribe((res: HttpResponse<IFinding>) => this.getFindingById(res.body));
      this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
        this.dpte = res.body;
        this.departament = this.getDepartament(closures.findClose.deptInvol);
      });
    });
  }
  getDepartament(dept: any) {
    return this.dpte.find(({ id }) => id === dept);
  }

  getFindingById(data: IFinding) {
    this.finding = data;
    this.isSaving = false;
  }

  updateForm(closures: IClosures) {
    this.editForm.patchValue({
      id: closures.id,
      stateClosure: closures.stateClosure,
      actionClosed: closures.actionClosed,
      effectiveness: closures.effectiveness,
      dept: closures.dept,
      improveComment: closures.improveComment,
      effectivenessComment: closures.effectivenessComment,
      findClose: closures.findClose
    });
  }

  save() {
    window.scroll(0, 0);
    if (this.editForm.status === 'VALID') {
      this.isSaving = true;
      const closures = this.createFromForm();
      this.subscribeToSaveResponse(this.closuresService.update(closures));
    } else {
      alert('Todos los campos son requeridos');
    }
  }

  private createFromForm(): IClosures {
    return {
      ...new Closures(),
      id: this.editForm.get(['id']).value,
      stateClosure: this.editForm.get(['stateClosure']).value,
      actionClosed: this.editForm.get(['actionClosed']).value,
      effectiveness: this.editForm.get(['effectiveness']).value,
      dept: this.editForm.get(['dept']).value,
      improveComment: this.editForm.get(['improveComment']).value,
      effectivenessComment: this.editForm.get(['effectivenessComment']).value,
      findClose: this.editForm.get(['findClose']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClosures>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.router.navigateByUrl('/finding/records');
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
