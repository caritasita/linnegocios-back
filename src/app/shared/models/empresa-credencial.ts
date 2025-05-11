import { Empresa } from './Empresa';
import { User } from './User';
import {ProveedorFacturacion} from './proveedor-facturacion';

export class EmpresaCredencial {
  id!: number;
  empresa!: Empresa;
  usuarioRegistro!: User;
  usuario!: string;
  password!: string;
  activo!: boolean;
  userActualizo!: User;
  fechaCreacion!: Date;
  fechaActualizacion!: Date;
  proveedorFacturacion!: ProveedorFacturacion;
  url!: string;
  creditos = 'click para consultar';
}
