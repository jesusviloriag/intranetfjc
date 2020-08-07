import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from 'app/shared/model/document.model';
import { DocumentService } from './document.service';
import { DocumentComponent } from './document.component';
import { DocumentDetailComponent } from './document-detail.component';
import { DocumentUpdateComponent } from './document-update.component';
import { DocumentMasterComponent } from './document-master.component';
import { DocumentSearchComponent } from './document-search.component';
import { IDocument } from 'app/shared/model/document.model';
import { DocumentCreateComponent } from './document-create.component';
import { DocumentModifyComponent } from './document-modify.component';
import { DocumentInfoComponent } from './document-info.component';

@Injectable({ providedIn: 'root' })
export class DocumentResolve implements Resolve<IDocument> {
  constructor(private service: DocumentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocument> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((document: HttpResponse<Document>) => document.body));
    }
    return of(new Document());
  }
}

export const documentRoute: Routes = [
  {
    path: '',
    component: DocumentComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.document.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'search',
    component: DocumentSearchComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.document.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'master',
    component: DocumentMasterComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.document.master.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DocumentDetailComponent,
    resolve: {
      document: DocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.document.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DocumentUpdateComponent,
    resolve: {
      document: DocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.document.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'create',
    component: DocumentCreateComponent,
    resolve: {
      document: DocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.document.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DocumentUpdateComponent,
    resolve: {
      document: DocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.document.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/update',
    component: DocumentModifyComponent,
    resolve: {
      document: DocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.document.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/info',
    component: DocumentInfoComponent,
    resolve: {
      document: DocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.document.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
