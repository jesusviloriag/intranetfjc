import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInDepartment } from 'app/shared/model/user-in-department.model';
import { UserInDepartmentService } from './user-in-department.service';
import { UserInDepartmentComponent } from './user-in-department.component';
import { UserInDepartmentDetailComponent } from './user-in-department-detail.component';
import { UserInDepartmentUpdateComponent } from './user-in-department-update.component';
import { IUserInDepartment } from 'app/shared/model/user-in-department.model';

@Injectable({ providedIn: 'root' })
export class UserInDepartmentResolve implements Resolve<IUserInDepartment> {
  constructor(private service: UserInDepartmentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserInDepartment> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((userInDepartment: HttpResponse<UserInDepartment>) => userInDepartment.body));
    }
    return of(new UserInDepartment());
  }
}

export const userInDepartmentRoute: Routes = [
  {
    path: '',
    component: UserInDepartmentComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.userInDepartment.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: UserInDepartmentDetailComponent,
    resolve: {
      userInDepartment: UserInDepartmentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.userInDepartment.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: UserInDepartmentUpdateComponent,
    resolve: {
      userInDepartment: UserInDepartmentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.userInDepartment.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: UserInDepartmentUpdateComponent,
    resolve: {
      userInDepartment: UserInDepartmentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.userInDepartment.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
