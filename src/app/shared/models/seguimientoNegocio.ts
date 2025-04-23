import {Negocio} from './negocio';
import {TipoSeguimientoNegocio} from './tipoSeguimientoNegocio';
import {EstatusSeguimientoNegocio} from './estatusSeguimientoNegocio';
import {User} from './User';
import {Buzon} from './Buzon';


export class SeguimientoNegocio {
  negocio!: Negocio;
  buzon!: Buzon;
  tipoSeguimiento!: TipoSeguimientoNegocio;
  estatusSeguimiento!: EstatusSeguimientoNegocio;
  agente!: User;
  mensaje!: string;
  activo!: boolean;
  dateCreated!: Date;
  lastUpdated!: Date;
  lastUpdatedBy!: Date;
}
