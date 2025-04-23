import { User } from './User';

export interface MetaActivacion {
  id: number | null;
  clave: string;
  porcentajeMeta: number;
  bonoExtra: number;
  dateCreated: Date;
  lastUpdated: Date;
  lastUpdatedBy: User;
  createdBy: User;
}
