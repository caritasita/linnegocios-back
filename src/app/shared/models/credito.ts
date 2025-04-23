import { Cliente } from './cliente';
import { User } from './User';
import { CreditoEstatus } from './creditoEstatus';
import { Sucursal } from './sucursal';
import { TipoCredito } from './tipo-credito';
import { Negocio } from './negocio';

export class Credito {
  id: number;
  cliente: Cliente;
  credito: number; // linea de credito
  creditoConsumido: number; // lo que ha usado  +50 -20 -30 + 100
  creditoEstatus: CreditoEstatus;
  fechaRegistro: Date;
  usuarioRegistro: User;
  usuarioAutorizo: User;
  negocio: Negocio;
}

