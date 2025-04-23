import {MetodoDePago} from './MetodoDePago';
import {Ventas} from "./ventas";

export class VentaMetodo {
  id: number;
  venta: Ventas;
  metodoDePago: MetodoDePago;
  descripcion: string;
  total: number;
}
