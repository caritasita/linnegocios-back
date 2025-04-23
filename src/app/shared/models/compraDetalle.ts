import {Compra} from './compra';
import {Producto} from './producto';
import {CategoriaProducto} from './CategoriaProducto';

export class CompraDetalle {
  compra: Compra;
  producto: Producto;
  cantidad: number;
  id: number;
  precioVenta: number;
  precioCompra: number;
  total: number;
  subtotal: number;
  iva: number;
  utilidad: number;
  cantidadDisponible: number;
  tipoCompra: TipoCompra;
  idTemporal: string;
  categoriaProductoAxiliar: CategoriaProducto;
  fecha?: Date;
}

export enum TipoCompra {
  COMPRA_PRODUCTOS, COMPRA_PRODUCTOS_PROMOCION
}
