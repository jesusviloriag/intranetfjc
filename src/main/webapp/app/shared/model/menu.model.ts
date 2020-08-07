export interface IMenu {
  id?: number;
  prueba?: string;
}

export class Menu implements IMenu {
  constructor(public id?: number, public prueba?: string) {}
}
