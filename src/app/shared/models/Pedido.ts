import { Producto } from './producto';

export class Pedido {
  id: string;
  cliente: {
    nombreCompleto: string,
    telefonoCelular: string;
  };
  direccionEntrega: {
    coordenadas: { latitude: number, longitude: number },
    nombreRecibe: string,
    numeroExterior: string,
    numeroInterior: string,
    referencias: string,
    telefono: string,
  };
  estatus: {
    clave: string,
    nombre: string,
    descripcion: string,
  };
  pedido: {
    especificaciones: string,
    horaCreacion: string,
    precioEnvioCliente: number,
    precioEnvioNegocio: string,
    productos: Producto[],
    totalPedido: number,
    totalVenta: number,
  };
  repartidor: {
    id: number,
    nombreCompleto: string,
    telefonoCeluldar: string,
    fotoPerfil: string,
    fotoRedSocial: string,
    vehiculo: {
      placas: string,
      tipoVehiculo: {
        nombre: string,
        clave: string,
      }
    }
  };
  badgeCliente = 0;
  badgeRepartidor = 0;
}
