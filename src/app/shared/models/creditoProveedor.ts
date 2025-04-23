import { Proveedor } from './proveedor';
import { Compra } from './compra';

export class CreditoProveedor {
  id: number;
  proveedor: Proveedor;
  compra: Compra;
  total: number;
  inicial: number;
  adeudo: number;
  estatus!: boolean;
  periodoCobro!: string;
  interes!: number;
  cantidadPeriodos!: number;
  fechaLimitePago?: Date;
  // Var aux para mostrar la fecha límite de pago en el input date
  fechaLimitePagoCompleta?: Date;
}
