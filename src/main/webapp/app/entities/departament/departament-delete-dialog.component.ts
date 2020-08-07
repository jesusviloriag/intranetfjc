import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDepartament } from 'app/shared/model/departament.model';
import { DepartamentService } from './departament.service';

@Component({
  templateUrl: './departament-delete-dialog.component.html'
})
export class DepartamentDeleteDialogComponent {
  departament: IDepartament;

  constructor(
    protected departamentService: DepartamentService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.departamentService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'departamentListModification',
        content: 'Deleted an departament'
      });
      this.activeModal.dismiss(true);
    });
  }
}
