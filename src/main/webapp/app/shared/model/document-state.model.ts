export interface IDocumentState {
  id?: number;
  nameEs?: string;
  nameEn?: string;
  descriptionEs?: string;
  descriptionEn?: string;
}

export class DocumentState implements IDocumentState {
  constructor(
    public id?: number,
    public nameEs?: string,
    public nameEn?: string,
    public descriptionEs?: string,
    public descriptionEn?: string
  ) {}
}
