import { CompraDetalle } from './compraDetalle';
import { Proveedor } from './proveedor';

export class ProveedorProducto {
  id: number;
  compraDetalle: CompraDetalle;
  cantidadDisponible: number;
  disponible: boolean;
  proveedor: Proveedor;
  tipo: string;
  laChida:Date;
}
