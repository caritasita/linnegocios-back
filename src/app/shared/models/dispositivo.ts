export class DispositivoData {
  userAgent!: string;
  dispositivo!: Dispositivo;
  tipo!: string;

}

export class Dispositivo {
  tipo!: string;
  modelo!: string;
  marca!: string;
  plataforma!: string;
  sistemaOperativo!: string;
}
