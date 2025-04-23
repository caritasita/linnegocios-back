import { Catalogo } from './catalogo';
import {PedidoEstatus} from './PedidoEstatus';

export class Motivo extends Catalogo {

  rolUsuario: string[];
  tipo: string[];
  pedidoEstatus: PedidoEstatus[];

}

export enum TipoMotivo {
  TIPO_CANCELACION = 'tipo_cancelacion',
  TIPO_RECHAZO = 'tipo_rechazo',
  TIPO_PROBLEMA_RECOLECCION = 'tipo_problema_recoleccion'
}

export enum TipoRolMotivo {
  TIPO_CLIENTE = 'cliente',
  TIPO_RECHAZO = 'repartidor',
  TIPO_SUCURSAL = 'sucursal'
}
