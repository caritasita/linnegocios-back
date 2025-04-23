import {User} from './User';

export interface CumplimientoMeta {
  id: number;
  agente: User;
  negociosAtendidos: number;
  negociosActivados: 0;
  porcentajeActivados: 0;
  porcentajeMeta: 1;
  bonoExtra: 75;
  metaCumplida: boolean;
  metaVerificada: boolean;
}
