import {Estatus} from './estatus';


export class Documento extends Archivo {
  estatus: Estatus = null;
  descripcion: string; // es la descripcion del por que se esta invalidando el expediente
  url: string; // es la descripcion del por que se esta invalidando el expediente
  titulo: string; // es la descripcion del por que se esta invalidando el expediente

  tipoDocumento: string;
}
