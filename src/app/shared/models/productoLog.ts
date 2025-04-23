import { ProveedorProducto } from './proveedorProducto';
import { TipoMovimiento } from './TipoMovimiento';
import { User } from './User';
import { Sucursal } from './sucursal';
import { TipoTag } from './TipoTag';
import {Producto} from './producto';
import {Negocio} from './negocio';

export class ProductoLog {
  id: number;
  dominio: string;
  idDominio: number;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  cantidadInicial: number;
  cantidadFinal: number;
  proveedorProducto: ProveedorProducto;
  utilidad: number;
  precioCompra: number;
  precioVenta: number;
  usuarioRegistro: User;
  fechaRegistro: Date;
  sucursal: Sucursal;
  tag: TipoTag;
  producto?: Producto;
  negocio?: Negocio;
}
