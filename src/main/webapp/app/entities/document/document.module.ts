import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { DocumentComponent } from './document.component';
import { DocumentDetailComponent } from './document-detail.component';
import { DocumentUpdateComponent } from './document-update.component';
import { DocumentDeleteDialogComponent } from './document-delete-dialog.component';
import { DocumentMasterComponent } from './document-master.component';
import { DocumentCreateComponent } from './document-create.component';
import { DocumentSearchComponent } from './document-search.component';
import { DocumentModifyComponent } from './document-modify.component';
import { DocumentModalComponent } from './document-modal.component';
import { DocumentInfoComponent } from './document-info.component';
import { documentRoute } from './document.route';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(documentRoute)],
  declarations: [
    DocumentComponent,
    DocumentDetailComponent,
    DocumentCreateComponent,
    DocumentUpdateComponent,
    DocumentSearchComponent,
    DocumentDeleteDialogComponent,
    DocumentModifyComponent,
    DocumentMasterComponent,
    DocumentModalComponent,
    DocumentInfoComponent
  ],
  entryComponents: [DocumentDeleteDialogComponent]
})
export class FjcintranetDocumentModule {}
