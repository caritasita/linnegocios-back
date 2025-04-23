import {Catalogo} from "./catalogo";
import {User} from "./User";
import {Negocio} from "./negocio";
import {MarcaProductoEstatus} from "./MarcaProductoEstatus";
import {GiroComercial} from "./GiroComercial";

export class MarcaProducto extends Catalogo {
  usuarioRegistro: User;
  fechaRegistro: string;
  negocio: Negocio;
  marcaProductoEstatus: MarcaProductoEstatus;
  giroComercial:GiroComercial

}
