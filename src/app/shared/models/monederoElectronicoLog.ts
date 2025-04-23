import {MonederoElectronico} from './monederoElectronico';
import {TipoMovimiento} from './TipoMovimiento';
import {Sucursal} from './sucursal';
import {Negocio} from './negocio';
import {Empresa} from './Empresa';
import {Ventas} from './ventas';
import {TipoTag} from './TipoTag';
import {User} from './User';

export class MonederoElectronicoLog {
  id: number;
  monederoElectronico: MonederoElectronico;
  tipoMovimiento: TipoMovimiento;
  sucursal!: Sucursal;
  negocio!: Negocio;
  empresa!: Empresa;
  tag: TipoTag;
  venta!: Ventas;
  fechaRegistro: Date;
  monto: number;
  puntosInicial: number;
  puntosFinal: number;
  descripcion: string;
  userRegistro!: User;
}

