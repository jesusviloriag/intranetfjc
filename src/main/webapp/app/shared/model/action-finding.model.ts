import { Moment } from 'moment';
import { IFinding } from 'app/shared/model/finding.model';

export interface IActionFinding {
  id?: number;
  descAction?: string;
  dateStartAction?: Moment;
  dateCommit?: Moment;
  dateRealCommit?: Moment;
  descHow?: string;
  involved?: string;
  status?: number;
  evidenceDocContentType?: string;
  evidenceDoc?: any;
  observation?: string;
  actFinding?: IFinding;
}

export class ActionFinding implements IActionFinding {
  constructor(
    public id?: number,
    public descAction?: string,
    public dateStartAction?: Moment,
    public dateCommit?: Moment,
    public dateRealCommit?: Moment,
    public descHow?: string,
    public involved?: string,
    public status?: number,
    public evidenceDocContentType?: string,
    public evidenceDoc?: any,
    public observation?: string,
    public actFinding?: IFinding
  ) {}
}
