import { Caja } from './caja';
import { Estatuspago } from './estatus-pago';
import { Negocio } from './negocio';
import { Pago } from './pago';
import { TipoMovimiento } from './TipoMovimiento';
import { User } from './User';

export class PagoDetalle {
  id: number;
  pago: Pago;
  usuarioPago: User;
  negocio: Negocio;
  caja: Caja;
  estatusPago: Estatuspago;
  fechaPago: Date;
  fechaRegistro: Date;
  fechaCorte: Date;
  tipoMovimiento: TipoMovimiento;
  monto: number;
  iva: number;
  subTotal: number;
  detalleTipo: string;
  descripcion: string;
  formaCobro: string;
  nuevaCaja: boolean;
  diasCobrados: number;
  pocentajeDescuento: number;
  montoDescuento: number;
  montoDescuentoMeses: number;
  montoNormal: number;
  metodoPago!: string;
}
