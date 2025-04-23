
import {User} from "./User";
import {TipoMovimiento} from "./TipoMovimiento";
import {MonederoElectronico} from "./monederoElectronico";

export class MonederoElectronicoDetalle {
  id: number;
  monederoElectronico: MonederoElectronico;
  tipoMovimiento: TipoMovimiento;
  usuarioRegistro: User;
  fechaRegistro: User;
  importe: number;
  creditoConsumidoAnterior: number;
}
