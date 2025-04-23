export interface HorarioSoporte {
  id: number;
  dia: number;
  disponible: boolean;
  horaApertura: number;
  horaCierre: number;
  minutoApertura: number;
  minutoCierre: number;
  nombreDia: string | any;
}
