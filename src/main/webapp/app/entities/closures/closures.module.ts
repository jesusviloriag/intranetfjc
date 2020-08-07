import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { ClosuresComponent } from './closures.component';
import { ClosuresDetailComponent } from './closures-detail.component';
import { ClosuresUpdateComponent } from './closures-update.component';
import { ClosuresDeleteDialogComponent } from './closures-delete-dialog.component';
import { ClosuresVerifyComponent } from './closures-verify.component';
import { closuresRoute } from './closures.route';
import { ClosuresCreateComponent } from './closures-create.component';
import { ClosuresModalComponent } from './closures-modal.component';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(closuresRoute)],
  declarations: [
    ClosuresComponent,
    ClosuresDetailComponent,
    ClosuresUpdateComponent,
    ClosuresDeleteDialogComponent,
    ClosuresCreateComponent,
    ClosuresVerifyComponent,
    ClosuresModalComponent
  ],
  entryComponents: [ClosuresDeleteDialogComponent]
})
export class FjcintranetClosuresModule {}
