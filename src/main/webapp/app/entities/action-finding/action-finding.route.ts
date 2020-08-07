import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionFinding } from 'app/shared/model/action-finding.model';
import { ActionFindingService } from './action-finding.service';
import { ActionFindingComponent } from './action-finding.component';
import { ActionFindingGlobalComponent } from './action-finding-global.component';
import { ActionFindingDetailComponent } from './action-finding-detail.component';
import { ActionFindingUpdateComponent } from './action-finding-update.component';
import { IActionFinding } from 'app/shared/model/action-finding.model';

@Injectable({ providedIn: 'root' })
export class ActionFindingResolve implements Resolve<IActionFinding> {
  constructor(private service: ActionFindingService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActionFinding> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((actionFinding: HttpResponse<ActionFinding>) => actionFinding.body));
    }
    return of(new ActionFinding());
  }
}

export const actionFindingRoute: Routes = [
  {
    path: '',
    component: ActionFindingComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.actionFinding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'globalActions',
    component: ActionFindingGlobalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.actionFinding.home.global'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ActionFindingDetailComponent,
    resolve: {
      actionFinding: ActionFindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.actionFinding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ActionFindingUpdateComponent,
    resolve: {
      actionFinding: ActionFindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.actionFinding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ActionFindingUpdateComponent,
    resolve: {
      actionFinding: ActionFindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.actionFinding.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
