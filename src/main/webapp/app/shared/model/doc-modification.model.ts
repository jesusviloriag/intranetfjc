import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { IDocument } from 'app/shared/model/document.model';

export interface IDocModification {
  id?: number;
  dateMod?: Moment;
  commit?: string;
  version?: string;
  docContentType?: string;
  doc?: any;
  author?: IUser;
  docMod?: IDocument;
}

export class DocModification implements IDocModification {
  constructor(
    public id?: number,
    public dateMod?: Moment,
    public commit?: string,
    public version?: string,
    public docContentType?: string,
    public doc?: any,
    public author?: IUser,
    public docMod?: IDocument
  ) {}
}
