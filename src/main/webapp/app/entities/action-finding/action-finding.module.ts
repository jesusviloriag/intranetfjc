import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { ActionFindingComponent } from './action-finding.component';
import { ActionFindingGlobalComponent } from './action-finding-global.component';
import { ActionFindingDetailComponent } from './action-finding-detail.component';
import { ActionFindingUpdateComponent } from './action-finding-update.component';
import { ActionFindingDeleteDialogComponent } from './action-finding-delete-dialog.component';
import { actionFindingRoute } from './action-finding.route';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(actionFindingRoute)],
  declarations: [
    ActionFindingComponent,
    ActionFindingGlobalComponent,
    ActionFindingDetailComponent,
    ActionFindingUpdateComponent,
    ActionFindingDeleteDialogComponent
  ],
  entryComponents: [ActionFindingDeleteDialogComponent]
})
export class FjcintranetActionFindingModule {}
