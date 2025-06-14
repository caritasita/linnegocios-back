import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {LogSeguimientoNegocioComponent} from '../negocio/log-seguimiento-negocio/log-seguimiento-negocio.component';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {lastValueFrom, Subscription} from 'rxjs';
import {TipoSeguimientoService} from '../../../core/services/tipo-seguimiento.service';
import {EstatusSeguimientoNegocioService} from '../../../core/services/estatus-seguimiento-negocio.service';
import {SeguimientoNegocioService} from '../../../core/services/seguimiento-negocio.service';
import {GenericoService} from '../../../core/services/generico.service';
import {CommonModule} from '@angular/common';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-seguimiento-negocio',
  standalone: true,
  imports: [
    CommonModule,
    MatDrawer,
    MatToolbar,
    MatIconButton,
    MatIconModule,
    FormDialogGenericoComponent,
  ],
  templateUrl: './seguimiento-negocio.component.html',
  styleUrl: './seguimiento-negocio.component.css'
})
export class SeguimientoNegocioComponent implements OnInit {

  @Input() negocioId!: number;
  fieldFormSeguimiento!: any[];
  tipoSeguimientoList!: any[]; // Debes inicializar esto
  estatusSeguimientoList!: any[]; // Debes inicializar esto
  datosComponenteExtra!: any;

  negocio!: number;
  private saveRequest: Subscription | null = null;

  LogSeguimientoNegocioComponent = LogSeguimientoNegocioComponent;
  @ViewChild('drawerSeguimientoNegocio') drawerSeguimientoNegocio!: MatDrawer;


  constructor(
    private genericoService: GenericoService,
    private tipoSeguimientoService: TipoSeguimientoService,
    private estatusSeguimientoNegocioService: EstatusSeguimientoNegocioService,
    private seguimientoNegocioService: SeguimientoNegocioService,
  ) {
  }

  ngOnInit() {}

  async open(negocio: number) {
    console.log(`***negocio ${negocio}`);
    this.negocio= negocio;
    await this.getTipoSeguimiento();
    await this.getEstatusSeguimiento();

    // Generar listas de seguimiento
    const listaTipoSeguimiento = this.tipoSeguimientoList?.map(ts => ({
      label: ts?.nombre,
      value: ts?.id
    }));

    const listaEstatusSeguimiento = this.estatusSeguimientoList?.map(ts => ({
      label: ts?.nombre,
      value: ts?.id
    }));

    this.fieldFormSeguimiento = [
      {
        form: 'seguimientoNegocio',
        fields: [
          [
            {
              name: 'tipoSeguimiento',
              label: 'Tipo de seguimiento',
              type: 'select',
              options: listaTipoSeguimiento,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'estatusSeguimiento',
              label: 'Estatus de seguimiento',
              type: 'select',
              options: listaEstatusSeguimiento,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'mensaje',
              label: 'Mensaje',
              value: 'mensaje',
              type: 'textarea',
              validation: [Validators.required]
            }
          ],
          [
            {
              name: 'programado',
              label: '¿Programar seguimiento?',
              value: 'programado',
              type: 'toggle',
            }
          ],
          [
            {
              name: 'tipoSeguimientoProgramado',
              label: 'Tipo de comunicación',
              options: listaTipoSeguimiento,
              type: 'select',
              dependsOn: 'seguimientoNegocio.programado',
            }
          ],
          [
            {
              name: 'fechaProgramada',
              label: 'Fecha programada',
              value: 'fechaProgramada',
              type: 'datepicker',
              dependsOn: 'seguimientoNegocio.programado',
            }
          ],
          [
            {
              name: 'hora',
              label: 'Hora de la cita',
              value: 'hora',
              type: 'timepicker',
              dependsOn: 'seguimientoNegocio.programado',
            }
          ],
          [
            {
              name: 'enlace',
              label: 'Link de capacitación',
              value: 'enlace',
              type: 'text',
              dependsOn: 'seguimientoNegocio.programado',
            }
          ],
        ]
      },
    ]

    this.datosComponenteExtra = {
      negocioId: negocio
    }
    this.drawerSeguimientoNegocio.open();
  }

  async getTipoSeguimiento(): Promise<void> {
    const response: any = await lastValueFrom(this.tipoSeguimientoService.list({all: true}));
    this.tipoSeguimientoList = response.data;
  }

  async getEstatusSeguimiento(): Promise<void> {
    const response: any = await lastValueFrom(this.estatusSeguimientoNegocioService.list({all: true}));
    this.estatusSeguimientoList = response.data;
  }

  registrarSeguimiento(seguimiento: any) {

    if (seguimiento.seguimientoNegocio.programado) {
      const hour: string = seguimiento.seguimientoNegocio.hora; // Ejemplo: "12:24"
      const [hours, minutes] = hour.split(':'); // hours = "12", minutes = "24"
      const numericHours = Number(hours);
      const numericMinutes = Number(minutes.split(' ')[0]);
      if (!(seguimiento.seguimientoNegocio.fechaProgramada instanceof Date)) {
        seguimiento.fechaProgramada = new Date(seguimiento.seguimientoNegocio.fechaProgramada); // Convertir si es necesario
      }

      seguimiento.seguimientoNegocio.fechaProgramada.setHours(numericHours, numericMinutes);
      seguimiento.seguimientoNegocio.fechaProgramada = seguimiento.seguimientoNegocio.fechaProgramada.toGMTString();
      seguimiento.hora = hours;
    }

    const data = {...seguimiento.seguimientoNegocio, negocio: this.negocio}
    this.saveRequest = this.seguimientoNegocioService.create(data).subscribe(() => {
      if (seguimiento) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
      });
      this.seguimientoNegocioService.updateListSeguimiento();
    });
  }

}
