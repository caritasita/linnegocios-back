import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {BuzonService} from '../../../core/services/buzon.service';
import {first, Subscription} from 'rxjs';
import {HorarioSoporte} from '../../../shared/models/horarioSoporte';

@Component({
  selector: 'app-horario-soporte',
  standalone: true,
  imports: [
    FormDialogGenericoComponent,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatDrawer,
    MatDrawerContainer,
    MatIcon,
    MatIconButton,
    MatToolbar,
    NgIf,
    TablaGenericaComponent
  ],
  templateUrl: './horario-soporte.component.html',
  styleUrl: './horario-soporte.component.css'
})
export class HorarioSoporteComponent implements OnInit, OnDestroy {
  dataList: Partial<HorarioSoporte>[] = [];
  totalRecords = 0;
  fieldsFilters!: FieldForm[];
  transformedPaisList!: any;
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'id', valor: 'ID', tipo: "texto"},
    {clave: 'nombreDia', valor: 'Día', tipo: "texto"},
    {clave: 'horaApertura', valor: 'Horario de apertura', tipo: "texto"},
    {clave: 'horaCierre', valor: 'Horario de cierre', tipo: "texto"},
    {clave: 'disponible', valor: 'Estatus', tipo: "boleano"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Activar/Desactivar',
      icon: 'toggle_on',
      tooltipText: 'Activar/Desactivar',
      changeColorDefault: true,
      changeIconBy: 'toggle_off',
      callback: (item: any) => this.changeEstatusHorario(item),
      // hideAction: (item: any) => {
      //   if(item.activo) {
      //     return !item.activo
      //   }
      //   return true
      // }
    },
    {

      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      // hideAction: (item: any) => {
      //   if(item.activo) {
      //     return !item.activo
      //   }
      //   return true
      // }
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  private subscription!: Subscription;

  constructor(
    private buzonService: BuzonService,
    private genericoService: GenericoService,
    private dialog: MatDialog
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.lista();
  }

  lista(resetOffset = false) {
    this.subscription = this.buzonService.refreshHorario().subscribe(() => this.getHorario());
  }

  getHorario(): any {
    this.buzonService.getHorarioSoporteList().pipe(first()).subscribe((res: HorarioSoporte[]) => {
      this.dataList = this.generarTablaPersonalizada(res);
    });
  }

  generarTablaPersonalizada(data: any): any {
    return data.map((item: any, index: number) => ({
      ...data[index],
      id: item?.id,
      nombreDia: item?.nombreDia,
      horaApertura: getHorario(item?.horaApertura, item?.minutoApertura),
      horaCierre: getHorario(item?.horaCierre, item?.minutoCierre),
      disponible: item.disponible,
      activo: item.disponible,
    }));
  }


  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: 'estado',
        fields: [
          [
            {
              name: 'filtroGeneral',
              label: 'Clave / Nombre',
              type: 'text',
            },
          ],
          [
            {
              name: 'pais',
              label: 'País',
              type: 'select',
              options: this.transformedPaisList,
            },
          ],
          [
            {
              name: 'registrosEliminados',
              label: 'Ver eliminados',
              type: 'toggle',
            },
          ]
        ]
      }

    ]
  }

  procesarfiltros(form: any) {
    form = form.estado
    this.queryParams = ({...this.queryParams, ...form});
    this.lista();
  }

  resetFormFiltros() {
    this.queryParams = {
      max: 10,
      offset: 0,
      filtroGeneral: '',
      registrosEliminados: false,
    };
    this.lista()
  }

  public handlePageChange(event: any) {
    this.queryParams.max = event.max;
    this.queryParams.offset = event.offset;
    this.lista();
  }


  async changeEstatusHorario(horario: HorarioSoporte) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Estás seguro de desactivar el horario?'
    );
    if (!isConfirmed) {
      return;
    }

    const payload = {
      dia: horario.dia,
      status: !horario.disponible
    };
    try {
      this.buzonService.setHorarioStatus(payload).pipe(first()).subscribe(() => {
        this.buzonService.setHorarioStatus(payload).pipe(first()).subscribe(() => {
          this.dataList[horario.dia - 1].disponible = payload.status;
        });
      });
    } catch {
    }

  }

  editHorario(horario: HorarioSoporte) {
    console.log(`horario ${horario.id}`);
  }

  openFormDialog(data: any = {}) {

    const fieldForms: FieldForm[] = [
      {
        form: 'horarioSoporte',
        fields: [
          [
            {
              name: 'horaApertura',
              label: 'Hora de inicio',
              value: 'horaApertura',
              type: 'timepicker',
              validation: Validators.required
            },
            {
              name: 'horaCierre',
              label: 'Hora de fin',
              value: 'horaCierre',
              type: 'timepicker',
              validation: Validators.required
            }
          ],
        ]
      }
    ]

    let titleDialog = ''
    if (data.id) {
      titleDialog = `Editar horario del día ${data.nombreDia}`
      this.genericoService.setFieldDisabled(fieldForms, 'clave', true)
    }

    console.table(data);

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fieldForms,
        data
      },
      disableClose: true,
      width: '50vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {

      result= result.horarioSoporte;

      const payload = {
        dia: data.dia,
        horaInicio: this.getHourAndMinuteSeparate(result.horaApertura).hour,
        minutoInicio: this.getHourAndMinuteSeparate(result.horaApertura).minute,
        horaCierre: this.getHourAndMinuteSeparate(result.horaCierre).hour,
        minutoCierre: this.getHourAndMinuteSeparate(result.horaCierre).minute,
        status: data.disponible
      };
      this.buzonService.setHorario(payload);
      this.lista();
      dialogRef.close();
    });
  }


  getHourAndMinuteSeparate(time: string){

    let hour: number = Number.parseInt(time.split(':')[0])
    if(time.split(':')[1].split(' ')[1] === 'PM'){
      hour= Number.parseInt(time.split(':')[0]) + 12;
    }
    const minute: number = Number.parseInt(time.split(':')[1].split(' ')[0]);
    return {hour, minute}
  }

}

function getHorario(hora: number, minuto: number): any {
  const hour: Date = new Date();
  hour.setHours(hora, minuto);
  return toTwelveHours(hour);
}

function toTwelveHours(horario: Date): string {
  let hora: string = horario.getHours().toString();
  let hour: number = horario.getHours();
  let moment = 'AM';
  if (horario.getHours() > 12) {
    hour = hour - 12;
    moment = 'PM';
  }
  hora = (hour < 10) ? '0' + hour : '' + hour;
  const minute = horario.getMinutes();
  const minuto = (minute < 10) ? '0' + minute : '' + minute;
  return hora + ':' + minuto + ' ' + moment;
}
