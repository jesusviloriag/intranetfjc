import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IActivity } from 'app/shared/model/activity.model';
import { ActivityService } from './activity.service';

@Component({
  templateUrl: './activity-delete-dialog.component.html'
})
export class ActivityDeleteDialogComponent {
  activity: IActivity;

  constructor(protected activityService: ActivityService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.activityService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'activityListModification',
        content: 'Deleted an activity'
      });
      this.activeModal.dismiss(true);
    });
  }
}
