import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity } from 'app/shared/model/activity.model';
import { ActivityService } from './activity.service';
import { ActivityComponent } from './activity.component';
import { ActivityDetailComponent } from './activity-detail.component';
import { ActivityUpdateComponent } from './activity-update.component';
import { ActivityCreateComponent } from './activity-create.component';
import { ActivityModifyComponent } from './activity-modify.component';
import { ActivityRecordsComponent } from './activity-records.component';
import { ActivityBookComponent } from './activity-book.component';
import { ActivityInfoComponent } from './activity-info.component';
import { IActivity } from 'app/shared/model/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityResolve implements Resolve<IActivity> {
  constructor(private service: ActivityService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivity> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((activity: HttpResponse<Activity>) => activity.body));
    }
    return of(new Activity());
  }
}

export const activityRoute: Routes = [
  {
    path: '',
    component: ActivityComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'records',
    component: ActivityRecordsComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'book',
    component: ActivityBookComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ActivityDetailComponent,
    resolve: {
      activity: ActivityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/info',
    component: ActivityInfoComponent,
    resolve: {
      activity: ActivityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ActivityUpdateComponent,
    resolve: {
      activity: ActivityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'create',
    component: ActivityCreateComponent,
    resolve: {
      activity: ActivityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ActivityUpdateComponent,
    resolve: {
      activity: ActivityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/modify',
    component: ActivityModifyComponent,
    resolve: {
      activity: ActivityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
