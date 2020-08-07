import { NgModule } from '@angular/core';

import './vendor';
import { FjcintranetSharedModule } from 'app/shared/shared.module';
import { FjcintranetCoreModule } from 'app/core/core.module';
import { FjcintranetAppRoutingModule } from './app-routing.module';
import { FjcintranetHomeModule } from './home/home.module';
import { FjcintranetEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    FjcintranetSharedModule,
    FjcintranetCoreModule,
    FjcintranetHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    FjcintranetEntityModule,
    FjcintranetAppRoutingModule,
    BrowserAnimationsModule
  ],
  declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [JhiMainComponent]
})
export class FjcintranetAppModule {}
