import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDocument } from 'app/shared/model/document.model';

type EntityResponseType = HttpResponse<IDocument>;
type EntityArrayResponseType = HttpResponse<IDocument[]>;

@Injectable({ providedIn: 'root' })
export class DocumentService {
  public resourceUrl = SERVER_API_URL + 'api/documents';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/documents';

  constructor(protected http: HttpClient) {}

  create(document: IDocument): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(document);
    return this.http
      .post<IDocument>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(document: IDocument): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(document);
    return this.http
      .put<IDocument>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDocument>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAll(all: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<IDocument[]>(`${this.resourceUrl}/pdf/all`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocument[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocument[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  createDocument(data: any): Observable<any> {
    const title = data.title;
    const cod = data.codDoc;
    const revision = data.rev;
    const date = data.creation.format(DATE_FORMAT);
    const info = `${title}~${cod}~${revision}~${date}`;
    const docType = data.typeDoc;
    const nameDoc = data.nameDoc;
    // eslint-disable-next-line no-console
    console.log(SERVER_API_URL);
    return this.http.get<any>(`${this.resourceUrl}/createDocument/${info}&doc=${docType}&nameDoc=${nameDoc}`, { observe: 'response' });
  }

  findByQueryDoc(req?: any): Observable<EntityArrayResponseType> {
    // eslint-disable-next-line no-console
    console.log(req);
    const dateLimit = req.dateLimit === '' ? 'no' : req.dateLimit.format(DATE_FORMAT);
    const status = req.state;
    const order = `${req.sort}-${req.order}-${req.page}-${req.userDpte.id}`;

    return this.http
      .get<IDocument[]>(`${this.resourceUrl}/records/${status}&${dateLimit}&${order}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(document: IDocument): IDocument {
    const copy: IDocument = Object.assign({}, document, {
      dateCreation: document.dateCreation != null && document.dateCreation.isValid() ? document.dateCreation.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateCreation = res.body.dateCreation != null ? moment(res.body.dateCreation) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((document: IDocument) => {
        document.dateCreation = document.dateCreation != null ? moment(document.dateCreation) : null;
      });
    }
    return res;
  }
}
