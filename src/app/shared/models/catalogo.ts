import { Negocio } from './negocio';
import { GiroComercial } from './GiroComercial';
import { User } from './User';

export class Catalogo {
  id!: number;
  clave!: string;
  descripcion!: string;
  activo!: boolean;
  nombre!: string;
  fechaRegistro!: string;
  usuarioRegistro?: User;
  negocio?: Negocio;
  giroComercial!: GiroComercial;
}
