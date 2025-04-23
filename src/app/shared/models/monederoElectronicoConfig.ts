import { CategoriaProducto } from './CategoriaProducto';
import { Negocio } from './negocio';
import { User } from './User';

export class MonederoElectronicoConfig {
  id: number;
  porcentaje: number;
  categoriaProducto: CategoriaProducto;
  categoriaProductoList: CategoriaProducto[];
  negocio: Negocio;
  estatus: boolean;
  usuarioRegistro: User;
  fechaRegistro: Date;
}

