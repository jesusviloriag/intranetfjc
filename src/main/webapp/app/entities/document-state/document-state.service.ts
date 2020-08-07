import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDocumentState } from 'app/shared/model/document-state.model';

type EntityResponseType = HttpResponse<IDocumentState>;
type EntityArrayResponseType = HttpResponse<IDocumentState[]>;

@Injectable({ providedIn: 'root' })
export class DocumentStateService {
  public resourceUrl = SERVER_API_URL + 'api/document-states';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/document-states';

  constructor(protected http: HttpClient) {}

  create(documentState: IDocumentState): Observable<EntityResponseType> {
    return this.http.post<IDocumentState>(this.resourceUrl, documentState, { observe: 'response' });
  }

  update(documentState: IDocumentState): Observable<EntityResponseType> {
    return this.http.put<IDocumentState>(this.resourceUrl, documentState, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDocumentState>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocumentState[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocumentState[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
