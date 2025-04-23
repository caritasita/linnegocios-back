import { Negocio } from './negocio';
import { Credito } from './credito';
import {DatosFacturaCliente} from './datosFacturaCliente';
import {Estatus} from './estatus';

export class Cliente {
  id: number;
  nombre: string;
  apeidoPaterno: string;
  apeidoMaterno: string;
  telefonoFijo: string;
  telefonoCelular: string;
  email: string;
  negocio: Negocio;
  estatus: boolean;
  credito: Credito;
  fechaRegistro: Date;
  hasBillingInformation: boolean;

  // Es como se reciben los datos de facturación del cliente
  datos: DatosFacturaCliente;
  // Forma de recibir el estatus del cliente en formato arreglo
  clienteEstatus: Estatus;
}
