
import {Corte} from "./Corte";
import {ComprobanteMetodoPago} from "./ComprobanteMetodoPago";

export class CorteComprobante {
  id: number;
  corte: Corte;
  comprobantePago: ComprobanteMetodoPago;
  cantidad: number;
  total: number;
}
