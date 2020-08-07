import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Closures } from 'app/shared/model/closures.model';
import { ClosuresService } from './closures.service';
import { ClosuresComponent } from './closures.component';
import { ClosuresDetailComponent } from './closures-detail.component';
import { ClosuresUpdateComponent } from './closures-update.component';
import { ClosuresCreateComponent } from './closures-create.component';
import { ClosuresVerifyComponent } from './closures-verify.component';
import { IClosures } from 'app/shared/model/closures.model';

@Injectable({ providedIn: 'root' })
export class ClosuresResolve implements Resolve<IClosures> {
  constructor(private service: ClosuresService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClosures> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((closures: HttpResponse<Closures>) => closures.body));
    }
    return of(new Closures());
  }
}

export const closuresRoute: Routes = [
  {
    path: '',
    component: ClosuresComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.closures.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ClosuresDetailComponent,
    resolve: {
      closures: ClosuresResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.closures.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ClosuresUpdateComponent,
    resolve: {
      closures: ClosuresResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.closures.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ClosuresUpdateComponent,
    resolve: {
      closures: ClosuresResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.closures.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id1/create',
    component: ClosuresCreateComponent,
    resolve: {
      closures: ClosuresResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.closures.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/verify',
    component: ClosuresVerifyComponent,
    resolve: {
      closures: ClosuresResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.closures.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
