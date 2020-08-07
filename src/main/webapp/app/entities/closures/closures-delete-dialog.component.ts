import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IClosures } from 'app/shared/model/closures.model';
import { ClosuresService } from './closures.service';

import { FindingService } from 'app/entities/finding/finding.service';
import { IFinding, Finding } from 'app/shared/model/finding.model';
import { Observable } from 'rxjs';

import { HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  templateUrl: './closures-delete-dialog.component.html'
})
export class ClosuresDeleteDialogComponent {
  closures: IClosures;

  constructor(
    protected closuresService: ClosuresService,
    public activeModal: NgbActiveModal,
    protected findingService: FindingService,
    protected eventManager: JhiEventManager
      ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(finding:any) {
    finding.dateClosure = null;
    const findingUpdate = this.createFromForm(finding);
    this.subscribeToSaveResponse(this.findingService.update(findingUpdate));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinding>>) {
    result.subscribe(() => this.onUpdateFinding(), () => this.onErrorFinding());
  }

  protected onUpdateFinding() {
    this.closuresService.delete(this.closures.id).subscribe(() => {
    this.eventManager.broadcast({
      name: 'closuresListModification',
      content: 'Deleted an closures'
    });
    this.activeModal.dismiss(true);
    });
  }

  protected onErrorFinding() {
     //eslint-disable-next-line
     console.log('No se actualizo');
  }

   private createFromForm(finding: any): IFinding {
    return {
      ...new Finding(),
      id: finding.id,
      codFinding: finding.codFinding,
      dateStart: moment(finding.dateStart),
      dateEnd: moment(finding.dateEnd),
      dateClosure: null,
      description: finding.description,
      evidence: finding.evidence,
      methodology: finding.methodology,
      linkDocContentType: finding.linkDocContentType,
      linkDoc: finding.linkDoc,
      descHow: finding.descHow,
      typeFinding: finding.typeFinding,
      deptInvol: finding.deptInvol,
      identificationCause: finding.identificationCause,
      correctiveAct:  finding.correctiveAct,
      actionDesc: finding.actionDesc,
      creator: finding.creator
    };
  }
}
