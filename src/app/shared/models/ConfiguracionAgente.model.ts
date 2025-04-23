import { ExperienciaAgente } from './ExperienciaAgente.model';
import { MetaActivacion } from './MetaActivacion.model';
import { User } from './User';

export interface ConfiguracionAgente {
  id: number | null;
  agente: User;
  experiencia: ExperienciaAgente;
  metaActivacion: MetaActivacion;
  horarios: HorarioAgente[];

  cantidadProspectosAsignados: number;

  dateCreated: Date;
  lastUpdated: Date;
  createdBy: User;
  lastUpdatedBy: User;
}

export interface HorarioAgente {
  dia: string;
  inicio: Date;
  fin: Date;
  turno: string;
}
