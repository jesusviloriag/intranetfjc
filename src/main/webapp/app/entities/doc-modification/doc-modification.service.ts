import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDocModification } from 'app/shared/model/doc-modification.model';

type EntityResponseType = HttpResponse<IDocModification>;
type EntityArrayResponseType = HttpResponse<IDocModification[]>;

@Injectable({ providedIn: 'root' })
export class DocModificationService {
  public resourceUrl = SERVER_API_URL + 'api/doc-modifications';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/doc-modifications';

  constructor(protected http: HttpClient) {}

  create(docModification: IDocModification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(docModification);
    return this.http
      .post<IDocModification>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(docModification: IDocModification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(docModification);
    return this.http
      .put<IDocModification>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDocModification>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByRelDoc(id: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<IDocModification[]>(`${this.resourceUrl}/find=${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findLastByRel(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<IDocModification[]>(`${this.resourceUrl}/last=${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocModification[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocModification[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(docModification: IDocModification): IDocModification {
    const copy: IDocModification = Object.assign({}, docModification, {
      dateMod: docModification.dateMod != null && docModification.dateMod.isValid() ? docModification.dateMod.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateMod = res.body.dateMod != null ? moment(res.body.dateMod) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((docModification: IDocModification) => {
        docModification.dateMod = docModification.dateMod != null ? moment(docModification.dateMod) : null;
      });
    }
    return res;
  }
}
