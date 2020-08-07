import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDocumentState } from 'app/shared/model/document-state.model';
import { DocumentStateService } from './document-state.service';

@Component({
  templateUrl: './document-state-delete-dialog.component.html'
})
export class DocumentStateDeleteDialogComponent {
  documentState: IDocumentState;

  constructor(
    protected documentStateService: DocumentStateService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.documentStateService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'documentStateListModification',
        content: 'Deleted an documentState'
      });
      this.activeModal.dismiss(true);
    });
  }
}
