import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {Pais} from '../../../shared/models/Pais';
import {Estado} from '../../../shared/models/Estado';
import {
  Field,
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {EstadoService} from '../../../core/services/estado.service';
import {PaisService} from '../../../core/services/pais.service';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {ComunicadoService} from '../../../core/services/comunicado.service';

@Component({
  selector: 'app-comunicado',
  standalone: true,
  imports: [
    FormGenericoComponent,
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
    TablaGenericaComponent,
    FormDialogGenericoComponent
  ],
  templateUrl: './comunicado.component.html',
  styleUrl: './comunicado.component.css'
})
export class ComunicadoComponent implements OnInit {
  dataList: Partial<Estado>[] = [];
  totalRecords = 0;
  fieldsFilters!: FieldForm[];
  transformedComunicadoList!: any;
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'comunicado', valor: 'Comunicado', tipo: "texto"},
    {clave: 'fechaInicio', valor: 'Fecha inicio', tipo: "fecha"},
    {clave: 'fechaFin', valor: 'Fecha fin', tipo: "fecha"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      hideAction: (item: any) => {
        if(item.activo) {
          return !item.activo
        }
        return true
      }
    },
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      callback: (item: any) => this.delete(item),
      hideAction: (item: any) => {
        if(item.activo) {
          return !item.activo
        }
        return true
      }
    },
    {
      name: 'Recuperar eliminado',
      icon: "restore_from_trash",
      tooltipText: 'Recuperar registro eliminado',
      callback: (item: any) => this.recoverRegister(item.id),
      hideAction: (item: any) => {
        if(!item.activo) {
          return item.activo
        }
        return true
      }
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private comunicadoService: ComunicadoService,
    private genericoService: GenericoService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.lista();
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.comunicadoService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((response: any) => {

        this.dataList = this.generarTablaPersonalizada(response.data);
        this.totalRecords = response.count;
      });
  }

  generarTablaPersonalizada(data: any): any {
    return data.map((item: any, index: number) => ({
      comunicado: item?.comunicado,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      activo: item.activo,
      ...data[index],
    }));
  }


  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: 'comunicado',
        fields: [
          [
            {
              name: 'rangoFechaInicio',
              label: 'DESDE',
              value: 'rangoFechaInicio',
              type: 'datepicker',
            },
            {
              name: 'rangoHoraInicio',
              label: 'HORA',
              value: 'rangoHoraInicio',
              type: 'timepicker',
            },
          ],
          [
            {
              name: 'rangoFechaFin',
              label: 'HASTA',
              value: 'rangoFechaFin',
              type: 'datepicker',
            },
            {
              name: 'rangoHoraFin',
              label: 'HORA',
              value: 'rangoHoraFin',
              type: 'timepicker',
            },
          ],
          [
            {
              name: 'registrosEliminados',
              label: 'Ver eliminados',
              type: 'toggle',
            }
          ]
        ]
      }
    ]
  }

  procesarfiltros(form: any) {
    this.queryParams = ({...this.queryParams, ...form.comunicado});
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

  openFormDialog(data: any = {}) {

    const fieldForms: FieldForm[] = [
      {
        form: 'comunicado',
        fields: [
          [
            {
              name: 'imagen',
              label: 'Imágen',
              value: 'imagen',
              type: 'file',
            }
          ],
          [
            {
              name: 'comunicado',
              label: 'Comunicado',
              value: 'comunicado',
              type: 'textarea',
              validation: [Validators.required]
            }
          ],
          [
            {
              name: 'fechaInicio',
              label: 'Fecha inicio',
              value: 'fechaInicio',
              type: 'datepicker',
              validation: Validators.required
            },
            {
              name: 'horaInicio',
              label: 'hora inicio',
              value: 'horaInicio',
              type: 'timepicker',
              // validation: Validators.required
            }
          ],
          [
            {
              name: 'fechaFin',
              label: 'Fecha fin',
              value: 'fechaFin',
              type: 'datepicker',
              validation: Validators.required
            },
            {
              name: 'horaFin',
              label: 'Hora fin',
              value: 'horaFin',
              type: 'timepicker',
              // validation: Validators.required
            }
          ],
        ]
      }
    ]

    let titleDialog = 'Registrar comunicado'
    if (data.id) {
      titleDialog = 'Editar comunicado'
    }

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
      result= result.comunicado

      result.fechaInicio= result.horaInicio ? this.setHour(result.fechaInicio, result.horaInicio) : new Date(result.fechaInicio).toISOString();
      result.fechaFin= result.horaFin ? this.setHour(result.fechaFin, result.horaFin) : new Date(result.fechaFin).toISOString();
      result.conHoras= (result.horaInicio || result.horaFin) || false;
      result.imagen = result?.imagen?.nombre ? result?.imagen : null;

      if (data.id) {
        console.table(data.imagen);
        result = ({...result, id: data.id})
        this.comunicadoService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.comunicadoService.create(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro creado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      }
      dialogRef.close();
    });
  }

  setHour(date: string, hour: string): string {
    const currentDate = new Date(date);
    const hoursSplit = hour.split(':');
    currentDate.setHours(Number(hoursSplit[0]));
    currentDate.setMinutes(Number(hoursSplit[1].split(' ')[0]));
    return currentDate.toISOString();
  }

  private async delete(objeto: any) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Está seguro de eliminar el registro?'
    );
    if (!isConfirmed) {
      return;
    }

    this.comunicadoService.delete(objeto.id).subscribe(() => {
      this.lista();
    });
  }

  private async recoverRegister(id: number) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Está seguro de recuperar el registro?'
    );
    if (!isConfirmed) {
      return;
    }
    this.comunicadoService.reactivate(id).subscribe(() => {
      this.lista(true);
    });
  }

}
