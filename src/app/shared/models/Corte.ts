import { User } from './User';
import { Caja } from './caja';
import { Negocio } from './negocio';
import { Sucursal } from './sucursal';

export class Corte {
  id: number;
  usuario: User;
  usuarioCorte: User;
  caja: Caja;
  sucursal: Sucursal;
  negocio: Negocio;
  estatus: boolean;
  fechaApertura: Date;
  fechaCierre: Date;
  efectivoApertura: number;
  efectivoCierre: number;
}
