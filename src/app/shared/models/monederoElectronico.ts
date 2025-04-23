import {Cliente} from "./cliente";
import {User} from "./User";

export class MonederoElectronico {
  id: number;
  cliente: Cliente;
  puntos: number;
  descripcion: string;
  estatus: boolean;
  bloqueado: boolean;
  usuarioRegistro: User;
  fechaRegistro: Date;
}

