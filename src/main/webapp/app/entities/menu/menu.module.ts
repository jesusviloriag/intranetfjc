import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { MenuComponent } from './menu.component';
import { menuRoute } from './menu.route';

@NgModule({
  imports: [FjcintranetSharedModule, RouterModule.forChild(menuRoute)],
  declarations: [MenuComponent]
})
export class FjcintranetMenuModule {}
