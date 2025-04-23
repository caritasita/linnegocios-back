import { Catalogo } from './catalogo';

export interface ImpuestoProducto extends Catalogo {
  porcentaje: number;
  impuesto: Catalogo;
}

const TipoImpuesto = {
  IVA: 'IVA',
  IEPS: 'IEPS',
};
