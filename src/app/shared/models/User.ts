import { Empresa } from './Empresa';
import { Negocio } from './negocio';
import {Archivo} from './Archivo';

export class User {
  id!: number;
  username!: string;
  password!: string;
  enabled = true;
  claveAutorizacion!: string;
  accountExpired = false;
  accountLocked = false;
  passwordExpired = false;
  nombre!: string;
  role!: string;
  roles!: string[];
  apeidoPaterno!: string;
  apeidoMaterno!: string;
  email!: string;
  telefono!: string;
  urlPicture!: string;
  mimetypes!: Archivo;
  empresa?: Empresa;
  negocio?: Negocio;
  esCuentaRestablecida = false;
  passwordTemp?: string;
}
