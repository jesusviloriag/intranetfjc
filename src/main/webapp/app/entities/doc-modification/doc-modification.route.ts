import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocModification } from 'app/shared/model/doc-modification.model';
import { DocModificationService } from './doc-modification.service';
import { DocModificationComponent } from './doc-modification.component';
import { DocModificationDetailComponent } from './doc-modification-detail.component';
import { DocModificationUpdateComponent } from './doc-modification-update.component';
import { DocModificationRegisterComponent } from './doc-modification-register.component';
import { DocModificationLogComponent } from './doc-modification-log.component';
import { IDocModification } from 'app/shared/model/doc-modification.model';

@Injectable({ providedIn: 'root' })
export class DocModificationResolve implements Resolve<IDocModification> {
  constructor(private service: DocModificationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocModification> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((docModification: HttpResponse<DocModification>) => docModification.body));
    }
    return of(new DocModification());
  }
}

export const docModificationRoute: Routes = [
  {
    path: '',
    component: DocModificationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.docModification.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/register/:title',
    component: DocModificationRegisterComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.docModification.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/register/:title',
    component: DocModificationRegisterComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.docModification.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'log',
    component: DocModificationLogComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.docModification.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DocModificationDetailComponent,
    resolve: {
      docModification: DocModificationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.docModification.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DocModificationUpdateComponent,
    resolve: {
      docModification: DocModificationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.docModification.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DocModificationUpdateComponent,
    resolve: {
      docModification: DocModificationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.docModification.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
