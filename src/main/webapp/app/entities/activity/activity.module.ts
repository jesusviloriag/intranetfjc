import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { ActivityComponent } from './activity.component';
import { ActivityDetailComponent } from './activity-detail.component';
import { ActivityUpdateComponent } from './activity-update.component';
import { ActivityInfoComponent } from './activity-info.component';
import { ActivityDeleteDialogComponent } from './activity-delete-dialog.component';
import { ActivityCreateComponent } from './activity-create.component';
import { ActivityModifyComponent } from './activity-modify.component';
import { ActivityRecordsComponent } from './activity-records.component';
import { ActivityBookComponent } from './activity-book.component';
import { ActivityModalComponent } from './activity-modal.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { activityRoute } from './activity.route';

@NgModule({
  imports: [
    FjcintranetSharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild(activityRoute)
  ],
  declarations: [
    ActivityComponent,
    ActivityDetailComponent,
    ActivityUpdateComponent,
    ActivityDeleteDialogComponent,
    ActivityCreateComponent,
    ActivityModifyComponent,
    ActivityInfoComponent,
    ActivityRecordsComponent,
    ActivityBookComponent,
    ActivityModalComponent
  ],
  entryComponents: [ActivityDeleteDialogComponent]
})
export class FjcintranetActivityModule {}
