import { Cliente } from './cliente';
import { Sucursal } from './sucursal';
import { User } from './User';

export interface Cotizacion {
  id: number | null;
  sucursal: Sucursal;
  cliente: Cliente;
  descripcion: string;
  notas: string;
  total: number;
  estatus: boolean;

  usuarioCreacion: User;
  dateCreated: Date;
  lastUpdated: Date;
}
