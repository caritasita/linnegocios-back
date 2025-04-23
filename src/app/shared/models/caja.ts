import { Sucursal } from './sucursal';
import { Negocio } from './negocio';
import { Licencia } from './licencia';

export class Caja {
  id: number;
  sucursal: Sucursal;
  negocio: Negocio;
  nombre: string;
  descripcion: string;
  estatus: boolean;
  licenciaCaja: Licencia;
  mesesCobro!: number;
  montoEnCaja: any;
}
