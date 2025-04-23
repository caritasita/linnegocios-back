
import { Negocio } from './negocio';
import {DatosFactura} from './datosFactura';
import {Archivo} from './Archivo';

export class DatosFacturaNegocio extends DatosFactura {
  id!: number;
  negocio!: Negocio;
  llavePrivada!: Archivo;
  certificado!: Archivo;
  password!: string;
}

