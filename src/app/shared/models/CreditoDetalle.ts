import {User} from "./User";
import {TipoMovimiento} from "./TipoMovimiento";
import {Credito} from "./credito";

export class CreditoDetalle {
  id: number;
  credito: Credito;
  tipoMovimiento: TipoMovimiento;
  usuarioRegistro: User;
  fechaRegistro: User;
  importe: number;
  creditoConsumidoAnterior: number;
}
