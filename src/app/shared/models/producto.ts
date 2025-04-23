import { TipoProducto } from './tipo-producto';
import { ProductoEstatus } from './productoEstatus';
import { Negocio } from './negocio';
import { UnidadMedida } from './unidad-medida';
import { MarcaProducto } from './MarcaProducto';
import { GiroComercial } from './GiroComercial';
import { CategoriaProducto } from './CategoriaProducto';

export class Producto {

  id: number;
  codigoBarras?: string;
  clave?: string;
  nombre: string;
  negocio: Negocio;
  tipoProducto: TipoProducto;
  unidadMedida: UnidadMedida;
  descripcion: string;
  marcaProducto: MarcaProducto;
  productoEstatus: ProductoEstatus;
  imagen: Archivo;
  imagenFrontal: Archivo;
  imagenTrasera: Archivo;
  imagenDerecha: Archivo;
  imagenIzquierda: Archivo;
  aplicaComision: boolean;
  codigoSat: string;
  giroComercial: GiroComercial;
  inventario: boolean;
  precioCompra: number;
  precio: number;
  stock: number;
  cantidad;
  categoriaProducto?: CategoriaProducto;
  cantidadApartados?: number;

}
