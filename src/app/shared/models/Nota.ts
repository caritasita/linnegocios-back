import { Catalogo } from './catalogo';
import { Estatus } from './estatus';
import { Sucursal } from './sucursal';

export class Nota extends Catalogo {
  sucursal: Sucursal;
  notaEstatus: Estatus;
}
