import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IActionFinding } from 'app/shared/model/action-finding.model';

type EntityResponseType = HttpResponse<IActionFinding>;
type EntityArrayResponseType = HttpResponse<IActionFinding[]>;

@Injectable({ providedIn: 'root' })
export class ActionFindingService {
  public resourceUrl = SERVER_API_URL + 'api/action-findings';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/action-findings';

  constructor(protected http: HttpClient) {}

  create(actionFinding: IActionFinding): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actionFinding);
    return this.http
      .post<IActionFinding>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(actionFinding: IActionFinding): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actionFinding);
    return this.http
      .put<IActionFinding>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IActionFinding>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAll(all: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<IActionFinding[]>(`${this.resourceUrl}/load=${all}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByRel(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<IActionFinding[]>(`${this.resourceUrl}/actId=${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IActionFinding[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IActionFinding[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(actionFinding: IActionFinding): IActionFinding {
    const copy: IActionFinding = Object.assign({}, actionFinding, {
      dateStartAction:
        actionFinding.dateStartAction != null && actionFinding.dateStartAction.isValid()
          ? actionFinding.dateStartAction.format(DATE_FORMAT)
          : null,
      dateCommit:
        actionFinding.dateCommit != null && actionFinding.dateCommit.isValid() ? actionFinding.dateCommit.format(DATE_FORMAT) : null,
      dateRealCommit:
        actionFinding.dateRealCommit != null && actionFinding.dateRealCommit.isValid()
          ? actionFinding.dateRealCommit.format(DATE_FORMAT)
          : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateStartAction = res.body.dateStartAction != null ? moment(res.body.dateStartAction) : null;
      res.body.dateCommit = res.body.dateCommit != null ? moment(res.body.dateCommit) : null;
      res.body.dateRealCommit = res.body.dateRealCommit != null ? moment(res.body.dateRealCommit) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((actionFinding: IActionFinding) => {
        actionFinding.dateStartAction = actionFinding.dateStartAction != null ? moment(actionFinding.dateStartAction) : null;
        actionFinding.dateCommit = actionFinding.dateCommit != null ? moment(actionFinding.dateCommit) : null;
        actionFinding.dateRealCommit = actionFinding.dateRealCommit != null ? moment(actionFinding.dateRealCommit) : null;
      });
    }
    return res;
  }
}
