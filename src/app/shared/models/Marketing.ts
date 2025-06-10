import {User} from './User';
import {Archivo} from './Archivo';


export class Marketing {
  id?: number;
  clave?: string;
  descripcion?: string;
  imagen?: Archivo;
  imagenPreview?: Archivo;
  activo?: boolean;
  fechaRegistro!: Date;
  usuarioRegistro!: User;
}
