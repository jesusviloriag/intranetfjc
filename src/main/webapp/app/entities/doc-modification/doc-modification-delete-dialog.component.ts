import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDocModification } from 'app/shared/model/doc-modification.model';
import { DocModificationService } from './doc-modification.service';

@Component({
  templateUrl: './doc-modification-delete-dialog.component.html'
})
export class DocModificationDeleteDialogComponent {
  docModification: IDocModification;

  constructor(
    protected docModificationService: DocModificationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.docModificationService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'docModificationListModification',
        content: 'Deleted an docModification'
      });
      this.activeModal.dismiss(true);
    });
  }
}
