import {DatosFactura} from './datosFactura';
import {Cliente} from './cliente';

export class DatosFacturaCliente extends DatosFactura {
  id!: number;
  cliente!: Cliente;
}

