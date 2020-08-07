import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDocumentType } from 'app/shared/model/document-type.model';

type EntityResponseType = HttpResponse<IDocumentType>;
type EntityArrayResponseType = HttpResponse<IDocumentType[]>;

@Injectable({ providedIn: 'root' })
export class DocumentTypeService {
  public resourceUrl = SERVER_API_URL + 'api/document-types';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/document-types';

  constructor(protected http: HttpClient) {}

  create(documentType: IDocumentType): Observable<EntityResponseType> {
    return this.http.post<IDocumentType>(this.resourceUrl, documentType, { observe: 'response' });
  }

  update(documentType: IDocumentType): Observable<EntityResponseType> {
    return this.http.put<IDocumentType>(this.resourceUrl, documentType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDocumentType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocumentType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocumentType[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
