import {User} from './User';
import {Negocio} from './negocio';
import {SeguimientoNegocio} from './seguimientoNegocio';


export interface BuzonSoporte {
  id: number;
  fecha: Date;
  usuarioPDV: User;
  tipoBuzon: string;
  estatus: string;
  mensaje: string;
  negocio: Negocio;
  anonimo: boolean;
  correo: string;
  telefono: string;
  ultimoSeguimiento?: Partial<SeguimientoNegocio> | null;
}
