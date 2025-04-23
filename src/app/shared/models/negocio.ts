import { Empresa } from './Empresa';
import {DispositivoData} from './dispositivo';
import {NegocioEstatus} from './negocioEstatus';
import {GiroComercial} from './GiroComercial';
import {Estado} from './Estado';
import {User} from './User';
import {DatosFacturaNegocio} from './datosFacturaNegocio';
import {SeguimientoNegocio} from './seguimientoNegocio';
import {ConfiguracionDistribucion} from './configuracionDistribucion';
import {Distribucion} from './distribucion';
import {Archivo} from './Archivo';

export class Negocio extends DispositivoData {
  id!: number;
  mesesCobro!: number;
  empresa!: Empresa;
  logotipo!: Archivo;
  idLinntae!: string;
  encodeImageLogotipo!: string;
  nombre!: string;
  negocioEstatus!: NegocioEstatus;
  giroComercial!: GiroComercial[];
  telefono!: string;
  fechaUltimaVenta?: Date;
  fechaVerificacion?: Date;
  email!: string;
  estado!: Estado;
  autoPago!: boolean;
  licencia!: any;
  activo!: boolean;
  diasSinVenta = 0;
  existSeguimiento!: boolean;
  logotipoData?: any;
  agente?: User;
  datosFacturaNegocio!: DatosFacturaNegocio;
  cp?: string;
  conteoInventarios = 0;

  ultimoSeguimiento?: Partial<SeguimientoNegocio> | null;

  configuracionDistribucion!: ConfiguracionDistribucion;
  distribucion!: Distribucion;
  distribucionActiva!: false;
  comisionRecargas!: number;
}
