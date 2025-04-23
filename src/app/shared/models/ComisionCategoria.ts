import {User} from "./User";
import {TipoProducto} from "./tipo-producto";

export class ComisionCategoria {
  id: number;
  tipoProducto: TipoProducto;
  comision: number;
  activo: boolean;
  usuarioRegistro: User;
  fechaRegistro: Date;
}
