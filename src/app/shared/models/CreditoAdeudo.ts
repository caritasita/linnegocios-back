import { Credito } from './credito';
import { Ventas } from './ventas';

export class CreditoAdeudo {
  id: number;
  credito: Credito;
  venta: Ventas;
  saldoAdeudo: number;
  estatusAdeudo: boolean;
  interes: number;
  cantidadPeriodos: number;
  periodoCrobro: number;
  apartado: boolean;
  peticionTable?: PeticionTable;
}

class PeticionTable {
  cliente: string;
  fecha: string;
  total: number;
  sucursal: string;
  adeudo: number;
  id: number;
}
