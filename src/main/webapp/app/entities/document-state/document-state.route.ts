import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentState } from 'app/shared/model/document-state.model';
import { DocumentStateService } from './document-state.service';
import { DocumentStateComponent } from './document-state.component';
import { DocumentStateDetailComponent } from './document-state-detail.component';
import { DocumentStateUpdateComponent } from './document-state-update.component';
import { IDocumentState } from 'app/shared/model/document-state.model';

@Injectable({ providedIn: 'root' })
export class DocumentStateResolve implements Resolve<IDocumentState> {
  constructor(private service: DocumentStateService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentState> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((documentState: HttpResponse<DocumentState>) => documentState.body));
    }
    return of(new DocumentState());
  }
}

export const documentStateRoute: Routes = [
  {
    path: '',
    component: DocumentStateComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.documentState.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DocumentStateDetailComponent,
    resolve: {
      documentState: DocumentStateResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.documentState.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DocumentStateUpdateComponent,
    resolve: {
      documentState: DocumentStateResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.documentState.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DocumentStateUpdateComponent,
    resolve: {
      documentState: DocumentStateResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.documentState.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
