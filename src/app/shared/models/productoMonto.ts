import {Producto} from './producto';
import {Monto} from './monto';

export class ProductoMonto {
  id: number;
  producto: Producto;
  monto: Monto;
  descripcion: string;
  imagenAyuda: string;
  imagenLogo: string;
  sku: string;
  idCarrier: string;
  status: boolean;
  digitoVerificador:boolean;
  comisionCategoriaProducto:any;
}
