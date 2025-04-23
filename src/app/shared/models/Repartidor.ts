import {User} from './User';
import {Estatus} from './estatus';
import {Documento} from './documento';
import {Ubicacion} from './sucursal';
import {Catalogo} from './catalogo';


export default class Repartidor extends User {
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefonoCelular: string;
  repartidorEstatus: Estatus;

  fotoPerfil: Documento;
  fotoINE: Documento;

  licenciaConducir: Documento;
  tarjetaCirculacion: Documento;
  seguro: Documento;

  ubicacionActual: Ubicacion;
  cartera: number;
  enServicio: boolean;
  vehiculo: Vehiculo;
  contactosRecomiendan: ContactoRecomienda[];
  razonRechazo: string;
  promedioCalificacion: number;
  totalEntregas: number;
  photoUrl: string;
  // La documentación agregada o que se debería agregar en base al tipo de vehiculo
  documentos: Documento[];
}

export class ContactoRecomienda {
  nombre: string;
  apellidos: string;
  telefono: string;
}

export class Vehiculo {
  tipoVehiculo: Catalogo;
  placas: string;
}
