import {TipoMovimiento} from './TipoMovimiento';
import {MetodoDePago} from './MetodoDePago';
import {User} from './User';
import {TipoTag} from './TipoTag';

export class CajaLog {
  dominio: string;
  idDominio: number;
  tipoMovimiento: TipoMovimiento;
  monto: number;
  metodoDePago: MetodoDePago;
  usuarioRegistro: User;
  fechaRegistro: string;
  tag: TipoTag;
  ticket: string;

}
