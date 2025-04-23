import { Catalogo } from './catalogo';
import { Negocio } from './negocio';

export class CategoriaProducto extends Catalogo {
  negocio: Negocio;
  esPublica = false;
}
