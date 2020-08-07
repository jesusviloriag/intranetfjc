import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUserInDepartment } from 'app/shared/model/user-in-department.model';
import { UserInDepartmentService } from './user-in-department.service';

@Component({
  templateUrl: './user-in-department-delete-dialog.component.html'
})
export class UserInDepartmentDeleteDialogComponent {
  userInDepartment: IUserInDepartment;

  constructor(
    protected userInDepartmentService: UserInDepartmentService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.userInDepartmentService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'userInDepartmentListModification',
        content: 'Deleted an userInDepartment'
      });
      this.activeModal.dismiss(true);
    });
  }
}
