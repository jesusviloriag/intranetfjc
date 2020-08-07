import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { UserInDepartmentComponent } from './user-in-department.component';
import { UserInDepartmentDetailComponent } from './user-in-department-detail.component';
import { UserInDepartmentUpdateComponent } from './user-in-department-update.component';
import { UserInDepartmentDeleteDialogComponent } from './user-in-department-delete-dialog.component';
import { userInDepartmentRoute } from './user-in-department.route';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(userInDepartmentRoute)],
  declarations: [
    UserInDepartmentComponent,
    UserInDepartmentDetailComponent,
    UserInDepartmentUpdateComponent,
    UserInDepartmentDeleteDialogComponent
  ],
  entryComponents: [UserInDepartmentDeleteDialogComponent]
})
export class FjcintranetUserInDepartmentModule {}
