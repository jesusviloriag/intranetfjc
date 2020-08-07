import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IActivity {
  id?: number;
  nameActivity?: string;
  dateStart?: Moment;
  dateLimit?: Moment;
  description?: string;
  deliverables?: string;
  dept?: string;
  involvedActivity?: string;
  status?: number;
  dateClosure?: Moment;
  creator?: IUser;
}

export class Activity implements IActivity {
  constructor(
    public id?: number,
    public nameActivity?: string,
    public dateStart?: Moment,
    public dateLimit?: Moment,
    public description?: string,
    public deliverables?: string,
    public dept?: string,
    public involvedActivity?: string,
    public status?: number,
    public dateClosure?: Moment,
    public creator?: IUser
  ) {}
}
