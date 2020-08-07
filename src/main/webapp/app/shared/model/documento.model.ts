import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IDocumento {
  id?: number;
  nombre?: string;
  fechaCreacion?: Moment;
  descripcion?: string;
  archivoContentType?: string;
  archivo?: any;
  creador?: IUser;
}

export class Documento implements IDocumento {
  constructor(
    public id?: number,
    public nombre?: string,
    public fechaCreacion?: Moment,
    public descripcion?: string,
    public archivoContentType?: string,
    public archivo?: any,
    public creador?: IUser
  ) {}
}
