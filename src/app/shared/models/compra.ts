import {Proveedor} from './proveedor';
import {Sucursal} from './sucursal';
import {CompraEstatus} from './compraEstatus';

export class Compra {
  id: number;
  fechaCompra: {
    fechaCompleta: string
    fecha: string
    hora: string
  };
  fechaRegistro: {
    fechaCompleta: string
    fecha: string
    hora: string
  };
  total: number;
  subTotal: number;
  iva: number;
  sucursal: Sucursal;
  proveedor: Proveedor;
  estatus: CompraEstatus;
  interes:number;
  periodoCobro:string;
  cantidadPeriodos:number;
  totalAdeudo:number;
}
