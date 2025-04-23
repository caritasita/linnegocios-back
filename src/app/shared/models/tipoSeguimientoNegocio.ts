import {User} from './User';

export class TipoSeguimientoNegocio {
  id?: number;
  clave?: string;
  descripcion?: string;
  activo?: boolean;
  nombre?: string;
  fechaRegistro?: string;
  lastUpdated?: Date;
  usuarioRegistro?: User;
  usuarioActualizo?: User;
}
