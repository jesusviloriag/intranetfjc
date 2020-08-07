import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentType } from 'app/shared/model/document-type.model';
import { DocumentTypeService } from './document-type.service';
import { DocumentTypeComponent } from './document-type.component';
import { DocumentTypeDetailComponent } from './document-type-detail.component';
import { DocumentTypeUpdateComponent } from './document-type-update.component';
import { IDocumentType } from 'app/shared/model/document-type.model';

@Injectable({ providedIn: 'root' })
export class DocumentTypeResolve implements Resolve<IDocumentType> {
  constructor(private service: DocumentTypeService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentType> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((documentType: HttpResponse<DocumentType>) => documentType.body));
    }
    return of(new DocumentType());
  }
}

export const documentTypeRoute: Routes = [
  {
    path: '',
    component: DocumentTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'fjcintranetApp.documentType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DocumentTypeDetailComponent,
    resolve: {
      documentType: DocumentTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.documentType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DocumentTypeUpdateComponent,
    resolve: {
      documentType: DocumentTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.documentType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DocumentTypeUpdateComponent,
    resolve: {
      documentType: DocumentTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'fjcintranetApp.documentType.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
