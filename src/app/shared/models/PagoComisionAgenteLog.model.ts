import {User} from './User';
import {Negocio} from './negocio';


export interface PagoComisionAgenteLogModel {
  agente: User;
  negocio?: Negocio;
  saldoInicial: number;
  saldoFinal: number;
  monto: number;
  descripcion: string;
  dateCreated: Date;
  lastUpdated: Date;
  createdBy?: User;
}
