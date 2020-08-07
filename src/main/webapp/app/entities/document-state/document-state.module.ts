import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { DocumentStateComponent } from './document-state.component';
import { DocumentStateDetailComponent } from './document-state-detail.component';
import { DocumentStateUpdateComponent } from './document-state-update.component';
import { DocumentStateDeleteDialogComponent } from './document-state-delete-dialog.component';
import { documentStateRoute } from './document-state.route';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(documentStateRoute)],
  declarations: [DocumentStateComponent, DocumentStateDetailComponent, DocumentStateUpdateComponent, DocumentStateDeleteDialogComponent],
  entryComponents: [DocumentStateDeleteDialogComponent]
})
export class FjcintranetDocumentStateModule {}
