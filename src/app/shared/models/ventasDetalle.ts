import {Producto} from './producto';
import {Ventas} from './ventas';

export class VentasDetalle {
  id: number;
  venta: Ventas;
  producto: Producto;
  cantidad: number;
  precio: number;
  total: number;
  subtotal: number;
  iva: number;
  idReferente: number;
  descripcion: string;
  color: string;
  tipoCargoAbono: TipoCargoAbono;
  cantidadDevolucion = 0;
}

export enum TipoCargoAbono {
  CARGO = 'cargo', ABONO = 'abono'
}
