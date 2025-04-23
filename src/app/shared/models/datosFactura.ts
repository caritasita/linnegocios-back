import { Estado } from './Estado';
import { Pais } from './Pais';
import {RegimenFiscal} from './RegimenFiscal';

export class DatosFactura {
  rfc!: string;
  regimenFiscal!: RegimenFiscal;
  noInterior!: number;
  noExterior!: number;
  razonSocial!: string;
  calle!: string;
  colonia!: string;
  cp!: string;
  ciudad!: string;
  pais!: Pais;
  estado!: Estado;
  email!: string;
  telefono!: string;
}
