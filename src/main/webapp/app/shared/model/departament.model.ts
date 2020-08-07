export interface IDepartament {
  id?: number;
  nameDepartament?: string;
  idDepartament?: number;
  shortDsc?: string;
}

export class Departament implements IDepartament {
  constructor(public id?: number, public nameDepartament?: string, public idDepartament?: number, public shortDsc?: string) {}
}
