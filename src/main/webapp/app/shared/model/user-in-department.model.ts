import { IUser } from 'app/core/user/user.model';
import { IDepartament } from 'app/shared/model/departament.model';

export interface IUserInDepartment {
  id?: number;
  user?: IUser;
  departament?: IDepartament;
}

export class UserInDepartment implements IUserInDepartment {
  constructor(public id?: number, public user?: IUser, public departament?: IDepartament) {}
}
