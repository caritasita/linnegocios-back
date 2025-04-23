import {Sucursal} from "./sucursal";
import {User} from "./User";
import {Ventas} from "./ventas";

export class CorteInventario {
  sucursal: Sucursal
  userRegistro: User
  userAutorizo: User
  fechaRegistro: Date
  cargaDocumentos: any
  venta: Ventas
}
