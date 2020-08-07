import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { IClosures, Closures } from 'app/shared/model/closures.model';
import { ClosuresService } from './closures.service';
import { IFinding } from 'app/shared/model/finding.model';
import { FindingService } from 'app/entities/finding/finding.service';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-closures-update',
  templateUrl: './closures-update.component.html',
  styleUrls: ['./closures-update.component.scss']
})
export class ClosuresUpdateComponent implements OnInit {
  isSaving: boolean;
  dpte: any;

  findcloses: IFinding[];

  editForm = this.fb.group({
    id: [],
    stateClosure: [],
    actionClosed: [],
    effectiveness: [],
    dept: [],
    improveComment: [],
    effectivenessComment: [],
    findClose: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected closuresService: ClosuresService,
    protected findingService: FindingService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.isSaving = true;
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });
    this.activatedRoute.data.subscribe(({ closures }) => {
      this.updateForm(closures);
    });
    this.findingService.query({ filter: 'closurefinding-is-null' }).subscribe(
      (res: HttpResponse<IFinding[]>) => {
        if (!this.editForm.get('findClose').value || !this.editForm.get('findClose').value.id) {
          this.findcloses = res.body;
        } else {
          this.findingService.find(this.editForm.get('findClose').value.id).subscribe(
            (subRes: HttpResponse<IFinding>) => {
              this.findcloses = [subRes.body].concat(res.body);
            },
            (subRes: HttpErrorResponse) => this.onError(subRes.message)
          );
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
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
      findClose: closures.findClose.id
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const closures = this.createFromForm();
    if (closures.id !== undefined) {
      this.subscribeToSaveResponse(this.closuresService.update(closures));
    } else {
      this.subscribeToSaveResponse(this.closuresService.create(closures));
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
}
