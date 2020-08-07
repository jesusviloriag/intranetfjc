import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDocumentType } from 'app/shared/model/document-type.model';
import { DocumentTypeService } from './document-type.service';

@Component({
  templateUrl: './document-type-delete-dialog.component.html'
})
export class DocumentTypeDeleteDialogComponent {
  documentType: IDocumentType;

  constructor(
    protected documentTypeService: DocumentTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.documentTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'documentTypeListModification',
        content: 'Deleted an documentType'
      });
      this.activeModal.dismiss(true);
    });
  }
}
