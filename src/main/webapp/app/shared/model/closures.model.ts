import { IFinding } from 'app/shared/model/finding.model';

export interface IClosures {
  id?: number;
  stateClosure?: string;
  actionClosed?: string;
  effectiveness?: number;
  dept?: string;
  improveComment?: string;
  effectivenessComment?: string;
  findClose?: IFinding;
}

export class Closures implements IClosures {
  constructor(
    public id?: number,
    public stateClosure?: string,
    public actionClosed?: string,
    public effectiveness?: number,
    public dept?: string,
    public improveComment?: string,
    public effectivenessComment?: string,
    public findClose?: IFinding
  ) {}
}
