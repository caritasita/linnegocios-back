import { User } from './User';

export interface ExperienciaAgente {
  id: number | null;
  clave: string;
  nombre: string;
  descripcion: string | null;
  cantidadProspectos: number;
  dateCreated: Date;
  lastUpdated: Date;
  lastUpdatedBy: User;
  createdBy: User;
}
