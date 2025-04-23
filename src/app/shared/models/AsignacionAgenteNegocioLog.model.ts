import { Negocio } from './negocio';
import { User } from './User';

export interface AsignacionAgenteNegocioLog {
  id?: number | null;
  agente: User;
  agenteAnterior?: User | null;
  negocio: Negocio;
  descripcion: string;

  dateCreated: Date;
  lastUpdated: Date;
}
