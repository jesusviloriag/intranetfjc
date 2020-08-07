import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IFinding {
  id?: number;
  codFinding?: string;
  dateStart?: Moment;
  dateEnd?: Moment;
  dateClosure?: Moment;
  description?: string;
  evidence?: string;
  methodology?: string;
  linkDocContentType?: string;
  linkDoc?: any;
  descHow?: string;
  typeFinding?: number;
  deptInvol?: number;
  identificationCause?: string;
  correctiveAct?: string;
  actionDesc?: string;
  creator?: IUser;
}

export class Finding implements IFinding {
  constructor(
    public id?: number,
    public codFinding?: string,
    public dateStart?: Moment,
    public dateEnd?: Moment,
    public dateClosure?: Moment,
    public description?: string,
    public evidence?: string,
    public methodology?: string,
    public linkDocContentType?: string,
    public linkDoc?: any,
    public descHow?: string,
    public typeFinding?: number,
    public deptInvol?: number,
    public identificationCause?: string,
    public correctiveAct?: string,
    public actionDesc?: string,
    public creator?: IUser
  ) {}
}
