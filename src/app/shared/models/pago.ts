import {Negocio} from './negocio';
import {Estatuspago} from './estatus-pago';
import {User} from './User';

export class Pago {

  negocio!: Negocio;
  iva!: number;
  subTotal!: number;
  totalPago!: number;
  estatusPago!: Estatuspago;
  fechaRegitro!: Date;
  fechaCorte!: Date;
  fechaDePago!: Date;
  usuarioPago!: User;
  descripcion!: string;
  productoElectronicoLog!: string;
}
