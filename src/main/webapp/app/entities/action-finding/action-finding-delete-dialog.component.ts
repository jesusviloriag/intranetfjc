import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IActionFinding } from 'app/shared/model/action-finding.model';
import { ActionFindingService } from './action-finding.service';

@Component({
  templateUrl: './action-finding-delete-dialog.component.html'
})
export class ActionFindingDeleteDialogComponent {
  actionFinding: IActionFinding;

  constructor(
    protected actionFindingService: ActionFindingService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.actionFindingService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'actionFindingListModification',
        content: 'Deleted an actionFinding'
      });
      this.activeModal.dismiss(true);
    });
  }
}
