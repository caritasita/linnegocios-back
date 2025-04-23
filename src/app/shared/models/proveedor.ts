import {Estado} from "./Estado";
import {RegimenFiscal} from "./RegimenFiscal";
import {Negocio} from "./negocio";
import {Empresa} from "./Empresa";
import {Pais} from "./Pais";

export class Proveedor {
  id: number;
  estatus: boolean;
  clave: string;
  razonSocial: string;
  nombre: string;
  rfc: string;
  calle: string;
  noExterior: number;
  noInterior: string;
  email: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  pais: Pais;
  estado: Estado;
  regimenFiscal: RegimenFiscal;
  negocio: Negocio;
  empresa: Empresa;
}
