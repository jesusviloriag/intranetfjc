import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Departament } from 'app/shared/model/departament.model';
import { DepartamentService } from './departament.service';
import { DepartamentComponent } from './departament.component';
import { DepartamentDetailComponent } from './departament-detail.component';
import { DepartamentUpdateComponent } from './departament-update.component';
import { IDepartament } from 'app/shared/model/departament.model';

@Injectable({ providedIn: 'root' })
export class DepartamentResolve implements Resolve<IDepartament> {
  constructor(private service: DepartamentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDepartament> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((departament: HttpResponse<Departament>) => departament.body));
    }
    return of(new Departament());
  }
}

export const departamentRoute: Routes = [
  {
    path: '',
    component: DepartamentComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.departament.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DepartamentDetailComponent,
    resolve: {
      departament: DepartamentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.departament.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DepartamentUpdateComponent,
    resolve: {
      departament: DepartamentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.departament.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DepartamentUpdateComponent,
    resolve: {
      departament: DepartamentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.departament.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
