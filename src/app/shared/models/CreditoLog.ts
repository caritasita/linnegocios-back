import { CreditoAdeudo } from './CreditoAdeudo';
import { Ventas } from './ventas';
import { TipoCargoAbono } from './ventasDetalle';

export class CreditoLog {
  id: number;
  creditoAdeudo: CreditoAdeudo;
  venta: Ventas;
  tipoCargoAbono: TipoCargoAbono;
  saldoInicial: number;
  saldoFinal: number;
  interes: number;
  capital: number;
  fechaLimitePago: Date;
  fechaDia: string;
  fechaHora: string;
  periodo: number;
  estatusPagado: boolean;
  bandera: boolean;
  checado: boolean;
  activo: boolean;
  apartado: boolean;
}
