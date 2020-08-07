import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IUserInDepartment } from 'app/shared/model/user-in-department.model';

type EntityResponseType = HttpResponse<IUserInDepartment>;
type EntityArrayResponseType = HttpResponse<IUserInDepartment[]>;

@Injectable({ providedIn: 'root' })
export class UserInDepartmentService {
  public resourceUrl = SERVER_API_URL + 'api/user-in-departments';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/user-in-departments';

  constructor(protected http: HttpClient) {}

  create(userInDepartment: IUserInDepartment): Observable<EntityResponseType> {
    return this.http.post<IUserInDepartment>(this.resourceUrl, userInDepartment, { observe: 'response' });
  }

  update(userInDepartment: IUserInDepartment): Observable<EntityResponseType> {
    return this.http.put<IUserInDepartment>(this.resourceUrl, userInDepartment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserInDepartment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByActualUser(): Observable<EntityResponseType> {
    return this.http.get<IUserInDepartment>(`${this.resourceUrl}/findActual`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserInDepartment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserInDepartment[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
