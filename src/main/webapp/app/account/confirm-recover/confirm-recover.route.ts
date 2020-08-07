import { Route } from '@angular/router';

import { ConfirmRecoverComponent } from './confirm-recover.component';

export const confirmRecoverRoute: Route = {
  path: 'reset/confirm',
  component: ConfirmRecoverComponent,
  data: {
    authorities: [],
    pageTitle: 'global.menu.account.password'
  }
};
