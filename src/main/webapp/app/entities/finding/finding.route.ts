import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Finding } from 'app/shared/model/finding.model';
import { FindingService } from './finding.service';
import { FindingComponent } from './finding.component';
import { FindingDetailComponent } from './finding-detail.component';
import { FindingUpdateComponent } from './finding-update.component';
import { FindingCreateComponent } from './finding-create.component';
import { FindingRecordsComponent } from './finding-records.component';
import { FindingViewComponent } from './finding-view.component';
import { FindingTrackingComponent } from './finding-tracking.component';
import { IFinding } from 'app/shared/model/finding.model';

@Injectable({ providedIn: 'root' })
export class FindingResolve implements Resolve<IFinding> {
  constructor(private service: FindingService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinding> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((finding: HttpResponse<Finding>) => finding.body));
    }
    return of(new Finding());
  }
}

export const findingRoute: Routes = [
  {
    path: '',
    component: FindingComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.finding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: FindingDetailComponent,
    resolve: {
      finding: FindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.finding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
    {
    path: ':id/findView',
    component: FindingViewComponent,
    resolve: {
      finding: FindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.finding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: FindingUpdateComponent,
    resolve: {
      finding: FindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.finding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'create',
    component: FindingCreateComponent,
    resolve: {
      finding: FindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.finding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'records',
    component: FindingRecordsComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.finding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: FindingUpdateComponent,
    resolve: {
      finding: FindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.finding.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/tracking',
    component: FindingTrackingComponent,
    resolve: {
      finding: FindingResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.finding.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
