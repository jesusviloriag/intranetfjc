import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { FindingComponent } from './finding.component';
import { FindingDetailComponent } from './finding-detail.component';
import { FindingUpdateComponent } from './finding-update.component';
import { FindingCreateComponent } from './finding-create.component';
import { FindingDeleteDialogComponent } from './finding-delete-dialog.component';
import { FindingRecordsComponent } from './finding-records.component';
import { FindingViewComponent } from './finding-view.component';
import { FindingTrackingComponent } from './finding-tracking.component';
import { FindingModalComponent } from './finding-modal.component';
import { findingRoute } from './finding.route';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(findingRoute)],
  declarations: [
    FindingComponent,
    FindingDetailComponent,
    FindingTrackingComponent,
    FindingRecordsComponent,
    FindingViewComponent,
    FindingCreateComponent,
    FindingUpdateComponent,
    FindingDeleteDialogComponent,
    FindingModalComponent
  ],
  entryComponents: [FindingDeleteDialogComponent]
})
export class FjcintranetFindingModule {}
