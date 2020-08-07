import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFinding } from 'app/shared/model/finding.model';
import { FindingService } from './finding.service';

@Component({
  templateUrl: './finding-delete-dialog.component.html'
})
export class FindingDeleteDialogComponent {
  finding: IFinding;

  constructor(protected findingService: FindingService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.findingService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'findingListModification',
        content: 'Deleted an finding'
      });
      this.activeModal.dismiss(true);
    });
  }
}
