import { Sucursal } from './sucursal';
import { VentaEstatus } from './ventaEstatus';
import { TipoComprobante } from './tipo-comprobante';
import { Cliente } from './cliente';
import { MetodoDePago } from './MetodoDePago';
import { User } from './User';
import { Corte } from './Corte';
import {DispositivoData} from './dispositivo';

export class Ventas extends DispositivoData {
  id: number;
  fecha: Date;
  total: number;
  subTotal: number;
  iva: number;
  sucursal: Sucursal;
  ventaEstatus: VentaEstatus;
  tipoComprobante: TipoComprobante;
  cajero: User;
  cliente: Cliente;
  metodoDePago: MetodoDePago;
  corte: Corte;
  ticket: string;
  facturaVenta: {
    id: number;
    estatus: string;
  };
  ventaFacturable: boolean;
  consecutivo: string;
}
