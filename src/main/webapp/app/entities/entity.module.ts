import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'menu',
        loadChildren: () => import('./menu/menu.module').then(m => m.FjcintranetMenuModule)
      },
      {
        path: 'activity',
        loadChildren: () => import('./activity/activity.module').then(m => m.FjcintranetActivityModule)
      },
      {
        path: 'document',
        loadChildren: () => import('./document/document.module').then(m => m.FjcintranetDocumentModule)
      },
      {
        path: 'finding',
        loadChildren: () => import('./finding/finding.module').then(m => m.FjcintranetFindingModule)
      },
      {
        path: 'doc-modification',
        loadChildren: () => import('./doc-modification/doc-modification.module').then(m => m.FjcintranetDocModificationModule)
      },
      {
        path: 'action-finding',
        loadChildren: () => import('./action-finding/action-finding.module').then(m => m.FjcintranetActionFindingModule)
      },
      {
        path: 'closures',
        loadChildren: () => import('./closures/closures.module').then(m => m.FjcintranetClosuresModule)
      },
      {
        path: 'departament',
        loadChildren: () => import('./departament/departament.module').then(m => m.FjcintranetDepartamentModule)
      },
      {
        path: 'user-in-department',
        loadChildren: () => import('./user-in-department/user-in-department.module').then(m => m.FjcintranetUserInDepartmentModule)
      },
      {
        path: 'document-state',
        loadChildren: () => import('./document-state/document-state.module').then(m => m.FjcintranetDocumentStateModule)
      },
      {
        path: 'document-type',
        loadChildren: () => import('./document-type/document-type.module').then(m => m.FjcintranetDocumentTypeModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class FjcintranetEntityModule {}
