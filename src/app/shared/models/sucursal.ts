import {Negocio} from './negocio';

export class Sucursal {

  id!: number;
  negocio!: Negocio;
  nombre!: string;
  descripcion!: string;
  telefono!: string;
  direccion!: string;
  estatus!: boolean;
  latitud!: number;
  longitud!: number;
  horarios!: Horario[];
  ecommerce:boolean=false;
  ubicacion!:Ubicacion;

}
export interface Ubicacion {
  coordinates:{
    latitud:any
    longitud:any
  },
  type:any
}

export interface Horario {
  dia: number ,
  diaNombre: string,
  estado: boolean,
  horaInicio: any,
  horaFin: any,
}

