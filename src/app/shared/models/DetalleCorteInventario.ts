import {CorteInventario} from "./CorteInventario";
import {Producto} from "./producto";

export class DetalleCorteInventario {
  corteInventario: CorteInventario
  producto: Producto
  cantidadIngresada: number
  cantidadInventario: number
  diferencia: number
  balance: String
}
