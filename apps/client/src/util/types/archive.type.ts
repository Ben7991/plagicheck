export enum DocumentType {
  PDF = 'PDF',
  TEXT = 'TEXT',
  WORD = 'WORD',
}

export type Archive = {
  id: number;
  title: string;
  createdAt: string;
  documentType: DocumentType;
};
