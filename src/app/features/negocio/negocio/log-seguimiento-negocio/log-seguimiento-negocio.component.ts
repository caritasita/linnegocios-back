import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatList, MatListItem} from '@angular/material/list';
import {DatePipe, NgForOf} from '@angular/common';
import {lastValueFrom} from 'rxjs';
import {SeguimientoNegocio} from '../../../../shared/models/seguimientoNegocio';
import {SeguimientoProgramadoNegocio} from '../../../../shared/models/seguimientoProgramadoNegocio';
import {SeguimientoProgramadoNegocioService} from '../../../../core/services/seguimiento-programado-negocio.service';
import {SeguimientoNegocioService} from '../../../../core/services/seguimiento-negocio.service';

@Component({
  selector: 'app-log-seguimiento-negocio',
  standalone: true,
  imports: [
    MatTabsModule,
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
    NgForOf,
    DatePipe
  ],
  templateUrl: './log-seguimiento-negocio.component.html',
  styleUrl: './log-seguimiento-negocio.component.scss'
})
export class LogSeguimientoNegocioComponent implements OnInit, OnChanges {

  @Input() negocioId: number = 0;

  seguimientoList: SeguimientoNegocio[] = [];
  countSeguimientos = 0;
  offsetSeguimiento = 0;
  maxSeguimiento = 10;
  seguimientoProgramadoList: SeguimientoProgramadoNegocio[] = [];
  countSeguimientosProgramados = 0;
  offsetSeguimientoProgramado = 0;
  maxSeguimientoProgramado = 10;

  constructor(
    private seguimientoNegocioService: SeguimientoNegocioService,
    private seguimientoProgramadoNegocioService: SeguimientoProgramadoNegocioService
  ) {
  }

  ngOnInit() {
    this.getSeguimiento();
    this.getSeguimientoProgramado();

    this.seguimientoNegocioService.datos$.subscribe((datos) => {
      console.log('ENTRANDO POR EL ESCUCHADOR');
      this.getSeguimiento();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['negocioId'] && changes['negocioId'].currentValue !== changes['negocioId'].previousValue) {
      this.getSeguimiento();
      this.getSeguimientoProgramado()
    }
  }

  async getSeguimiento(): Promise<void> {
    try {
      const response: any = await lastValueFrom(
        this.seguimientoNegocioService.list({
          max: this.maxSeguimiento,
          offset: this.maxSeguimiento * this.offsetSeguimiento,
          negocio: this.negocioId,
        })
      );
      this.seguimientoList = response.data;
      this.countSeguimientos = response.count;
    } catch (error) {
      console.error('Error en getSeguimiento:', error);
    }
  }

  async getSeguimientoProgramado(): Promise<void> {
    const response = await lastValueFrom(
      this.seguimientoProgramadoNegocioService.list({
        max: this.maxSeguimientoProgramado,
        offset: this.maxSeguimientoProgramado * this.offsetSeguimientoProgramado,
        negocio: this.negocioId,
      })
    );
    this.seguimientoProgramadoList = response.data;
    console.log('seguimientoProgramadoList');
    console.table(this.seguimientoProgramadoList);
    this.countSeguimientosProgramados = response.count;
  }
}
