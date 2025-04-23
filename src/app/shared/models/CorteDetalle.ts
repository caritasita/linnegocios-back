import {Corte} from "./Corte";
import {TipoMovimiento} from "./TipoMovimiento";

export class CorteDetalle {
  id: number;
  corte: Corte;
  tipoMovimiento: TipoMovimiento;
  fechaRegistro: Date;
  importe: number;
  efectivoAnterior: number;
}
