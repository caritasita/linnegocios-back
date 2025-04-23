import {Negocio} from './negocio';

export class CredencialElectronico {
  id: number;
  negocio: Negocio;
  password: string;
  usuario: string;
  idEquivalencia: number;
  tipoCredencial: string;
}
