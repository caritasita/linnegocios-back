import {Negocio} from './negocio';
import {TipoSeguimientoNegocio} from './tipoSeguimientoNegocio';
import {User} from './User';


export class SeguimientoProgramadoNegocio {
  negocio!: Negocio;
  tipoSeguimiento!: TipoSeguimientoNegocio;
  agente!: User;
  fechaProgramada!: Date;
  hora!: string;
  activo!: boolean;
  dateCreated!: Date;
  lastUpdated!: Date;
  lastUpdatedBy!: Date;
  enlace!: string;
  concretado!: boolean;
}

