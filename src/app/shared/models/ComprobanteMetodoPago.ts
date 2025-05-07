import { Catalogo } from './catalogo';
import { Pais } from './Pais';
import { MetodoDePago } from './MetodoDePago';
import { TipoComprobante } from './tipo-comprobante';
import {Archivo} from './Archivo';

export class ComprobanteMetodoPago extends Catalogo {

  valor!: number;
  pais!: Pais;
  imagen!: Archivo;
  tipo!: string;
  tipoComprobante!: TipoComprobante;
  simbolo!: string;
  metodoDePago!: MetodoDePago;

}
