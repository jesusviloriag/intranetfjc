import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IFinding } from 'app/shared/model/finding.model';

type EntityResponseType = HttpResponse<IFinding>;
type EntityArrayResponseType = HttpResponse<IFinding[]>;

@Injectable({ providedIn: 'root' })
export class FindingService {
  public resourceUrl = SERVER_API_URL + 'api/findings';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/findings';

  constructor(protected http: HttpClient) {}

  create(finding: IFinding): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(finding);
    return this.http
      .post<IFinding>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(finding: IFinding): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(finding);
    return this.http
      .put<IFinding>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFinding>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAll(all: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<IFinding[]>(`${this.resourceUrl}/load=${all}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFinding[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFinding[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByQueryFinding(req?: any): Observable<EntityArrayResponseType> {
    // eslint-disable-next-line no-console
    console.log(req);
    const startDate = req.startDate === '' ? '' : req.startDate.format(DATE_FORMAT);
    const limitDate = req.limitDate === '' ? '' : req.limitDate.format(DATE_FORMAT);
    const closureDate = req.closureDate;
    const order = `${req.sort}-${req.order}-${req.page}-${req.userDpte.id}`;

    return this.http
      .get<IFinding[]>(`${this.resourceUrl}/query/${startDate}&${limitDate}&${closureDate}&${order}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(finding: IFinding): IFinding {
    const copy: IFinding = Object.assign({}, finding, {
      dateStart: finding.dateStart != null && finding.dateStart.isValid() ? finding.dateStart.format(DATE_FORMAT) : null,
      dateEnd: finding.dateEnd != null && finding.dateEnd.isValid() ? finding.dateEnd.format(DATE_FORMAT) : null,
      dateClosure: finding.dateClosure != null && finding.dateClosure.isValid() ? finding.dateClosure.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateStart = res.body.dateStart != null ? moment(res.body.dateStart) : null;
      res.body.dateEnd = res.body.dateEnd != null ? moment(res.body.dateEnd) : null;
      res.body.dateClosure = res.body.dateClosure != null ? moment(res.body.dateClosure) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((finding: IFinding) => {
        finding.dateStart = finding.dateStart != null ? moment(finding.dateStart) : null;
        finding.dateEnd = finding.dateEnd != null ? moment(finding.dateEnd) : null;
        finding.dateClosure = finding.dateClosure != null ? moment(finding.dateClosure) : null;
      });
    }
    return res;
  }
}
