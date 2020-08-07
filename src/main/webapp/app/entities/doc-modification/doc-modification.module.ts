import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { DocModificationComponent } from './doc-modification.component';
import { DocModificationDetailComponent } from './doc-modification-detail.component';
import { DocModificationUpdateComponent } from './doc-modification-update.component';
import { DocModificationDeleteDialogComponent } from './doc-modification-delete-dialog.component';
import { DocModificationRegisterComponent } from './doc-modification-register.component';
import { docModificationRoute } from './doc-modification.route';
import { DocModificationLogComponent } from './doc-modification-log.component';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(docModificationRoute)],
  declarations: [
    DocModificationComponent,
    DocModificationDetailComponent,
    DocModificationUpdateComponent,
    DocModificationRegisterComponent,
    DocModificationLogComponent,
    DocModificationDeleteDialogComponent
  ],
  entryComponents: [DocModificationDeleteDialogComponent]
})
export class FjcintranetDocModificationModule {}
