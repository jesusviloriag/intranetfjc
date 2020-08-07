import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { DepartamentComponent } from './departament.component';
import { DepartamentDetailComponent } from './departament-detail.component';
import { DepartamentUpdateComponent } from './departament-update.component';
import { DepartamentDeleteDialogComponent } from './departament-delete-dialog.component';
import { departamentRoute } from './departament.route';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(departamentRoute)],
  declarations: [DepartamentComponent, DepartamentDetailComponent, DepartamentUpdateComponent, DepartamentDeleteDialogComponent],
  entryComponents: [DepartamentDeleteDialogComponent]
})
export class FjcintranetDepartamentModule {}
