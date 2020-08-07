import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IActivity } from 'app/shared/model/activity.model';

type EntityResponseType = HttpResponse<IActivity>;
type EntityArrayResponseType = HttpResponse<IActivity[]>;

@Injectable({ providedIn: 'root' })
export class ActivityService {
  public resourceUrl = SERVER_API_URL + 'api/activities';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/activities';

  constructor(protected http: HttpClient) {}

  create(activity: IActivity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(activity);
    return this.http
      .post<IActivity>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(activity: IActivity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(activity);
    return this.http
      .put<IActivity>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IActivity>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IActivity[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByFilter(req: any): Observable<EntityArrayResponseType> {
    // eslint-disable-next-line no-console
    console.log(req);
    const startDate = req.startDate === '' ? '' : req.startDate.format(DATE_FORMAT);
    const limitDate = req.limitDate === '' ? '' : req.limitDate.format(DATE_FORMAT);
    const status = req.status;
    const order = `${req.sort}-${req.order}-${req.page}-${req.userDpte.id}`;

    return this.http
      .get<IActivity[]>(`${this.resourceUrl}/query/${startDate}&${limitDate}&${status}&${order}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http
      .get<IActivity[]>(`${this.resourceUrl}/all`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IActivity[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(activity: IActivity): IActivity {
    const copy: IActivity = Object.assign({}, activity, {
      dateStart: activity.dateStart != null && activity.dateStart.isValid() ? activity.dateStart.format(DATE_FORMAT) : null,
      dateLimit: activity.dateLimit != null && activity.dateLimit.isValid() ? activity.dateLimit.format(DATE_FORMAT) : null,
      dateClosure: activity.dateClosure != null && activity.dateClosure.isValid() ? activity.dateClosure.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateStart = res.body.dateStart != null ? moment(res.body.dateStart) : null;
      res.body.dateLimit = res.body.dateLimit != null ? moment(res.body.dateLimit) : null;
      res.body.dateClosure = res.body.dateClosure != null ? moment(res.body.dateClosure) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((activity: IActivity) => {
        activity.dateStart = activity.dateStart != null ? moment(activity.dateStart) : null;
        activity.dateLimit = activity.dateLimit != null ? moment(activity.dateLimit) : null;
        activity.dateClosure = activity.dateClosure != null ? moment(activity.dateClosure) : null;
      });
    }
    return res;
  }
}
