import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IClosures } from 'app/shared/model/closures.model';

type EntityResponseType = HttpResponse<IClosures>;
type EntityArrayResponseType = HttpResponse<IClosures[]>;

@Injectable({ providedIn: 'root' })
export class ClosuresService {
  public resourceUrl = SERVER_API_URL + 'api/closures';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/closures';

  constructor(protected http: HttpClient) {}

  create(closures: IClosures): Observable<EntityResponseType> {
    return this.http.post<IClosures>(this.resourceUrl, closures, { observe: 'response' });
  }

  update(closures: IClosures): Observable<EntityResponseType> {
    return this.http.put<IClosures>(this.resourceUrl, closures, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClosures>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(all: string): Observable<EntityArrayResponseType> {
    return this.http.get<IClosures[]>(`${this.resourceUrl}/load=${all}`, { observe: 'response' });
  }

  findByIdFinding(id: number): Observable<EntityResponseType> {
    return this.http.get<IClosures>(`${this.resourceUrl}/idClosure=${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClosures[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClosures[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
