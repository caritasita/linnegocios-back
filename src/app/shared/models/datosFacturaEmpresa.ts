import {DatosFactura} from './datosFactura';
import {Empresa} from './Empresa';

export class DatosFacturaEmpresa extends DatosFactura {
  id: number;
  empresa: Empresa;
  estatus: boolean;
}

