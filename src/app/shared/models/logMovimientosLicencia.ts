import {User} from './User';

export class LogMovimientosLicencia {
  id!: number;
  fechaRegistro!: string;
  numeroDias!: number;
  tipoLicenciaAnterior!: string;
  tipoLicencia!: string;
  usuarioRegistro!: User;
}
