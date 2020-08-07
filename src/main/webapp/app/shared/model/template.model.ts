export interface ITemplate {
  id?: number;
}

export class Template implements ITemplate {
  constructor(public id?: number) {}
}
