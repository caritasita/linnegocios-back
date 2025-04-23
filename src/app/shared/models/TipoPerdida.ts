import { Catalogo } from './catalogo';
import { TipoPerdidaEstatus } from './TipoPerdidaEstatus';

export class TipoPerdida extends Catalogo {
  completo: string;
  tipoPerdidaEstatus: TipoPerdidaEstatus;
}
