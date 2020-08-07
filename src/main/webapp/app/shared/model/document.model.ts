import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { IDepartament } from 'app/shared/model/departament.model';
import { IDocumentState } from 'app/shared/model/document-state.model';
import { IDocumentType } from 'app/shared/model/document-type.model';

export interface IDocument {
  id?: number;
  codDoc?: string;
  nameDoc?: string;
  storage?: string;
  dateCreation?: Moment;
  duration?: string;
  finalDisposition?: string;
  origin?: number;
  docContentType?: string;
  doc?: any;
  content?: string;
  creator?: IUser;
  departament?: IDepartament;
  state?: IDocumentState;
  type?: IDocumentType;
}

export class Document implements IDocument {
  constructor(
    public id?: number,
    public codDoc?: string,
    public nameDoc?: string,
    public storage?: string,
    public dateCreation?: Moment,
    public duration?: string,
    public finalDisposition?: string,
    public origin?: number,
    public docContentType?: string,
    public doc?: any,
    public content?: string,
    public creator?: IUser,
    public departament?: IDepartament,
    public state?: IDocumentState,
    public type?: IDocumentType
  ) {}
}
