import {User} from './User';

export interface SaldoAgente {
  id: number;
  agente: User;
  saldo: number;
  dateCreated: Date;
  lastUpdated: Date;
}
