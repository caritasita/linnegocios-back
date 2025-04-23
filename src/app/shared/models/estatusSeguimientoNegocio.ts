import {User} from './User';


export class EstatusSeguimientoNegocio {
  id!: number;
  clave!: string;
  descripcion!: string;
  activo!: boolean;
  isLeadBasura!: boolean;
  nombre!: string;
  fechaRegistro!: string;
  lastUpdated!: Date;
  usuarioRegistro?: User;
  usuarioActualizo?: User;
}
