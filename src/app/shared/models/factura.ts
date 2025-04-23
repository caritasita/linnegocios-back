import { Cliente } from './cliente';
import { MetodoDePago } from './MetodoDePago';
import { User } from './User';
import { FacturaEstatus } from './facturaEstatus';
import { FacturaMetodoDePago } from './facturaMetodoDePago';
import { Negocio } from './negocio';
import { Proveedor } from './proveedor';
import { TipoFactura } from './tipoFactura';
import { UsoCFDI } from './usoCFDI';
import { Ventas } from './ventas';

export class Factura {
  id!: number;
  estatus!: FacturaEstatus;
  facturaMetodoPago!: FacturaMetodoDePago;
  fechaEmision!: Date;
  fechaRegistro!: Date;
  fechaTimbrado!: Date;
  fechaCancelado!: Date;
  folio!: string;
  mensaje!: string;
  uuid!: string;
  metodoDePago!: MetodoDePago;
  negocio!: Negocio;
  pdf!: Archivo;
  xml!: Archivo;
  xmlCancelado!: Archivo;
  proveedor!: Proveedor;
  iva!: number;
  subTotal!: number;
  total!: number;
  tipoFactura!: TipoFactura;
  usoCFDI!: UsoCFDI;
  cliente!: Cliente;
  venta!: Ventas;
  usuarioRegistro!: User;
  usuarioCancelo!: User;
  usuarioTimbro!: User;

}
