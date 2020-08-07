export interface IDocumentType {
  id?: number;
  name?: string;
  description?: string;
}

export class DocumentType implements IDocumentType {
  constructor(public id?: number, public name?: string, public description?: string) {}
}
