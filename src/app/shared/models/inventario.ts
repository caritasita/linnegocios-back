import {Producto} from './producto';
import {Negocio} from './negocio';
import {Sucursal} from './sucursal';
import {CategoriaProducto} from './CategoriaProducto';

export class Inventario {
  id: number;
  producto: Producto;
  categoriaProducto: CategoriaProducto;
  categoriaProductoAxiliar: CategoriaProducto;
  stock: number;
  cantidad: number;
  negocio: Negocio;
  sucursal: Sucursal;
  precio: number;
  precioCompra: number;
  ecommerce: boolean;
  cantidadApartados: number;
  estatus: boolean;
}
