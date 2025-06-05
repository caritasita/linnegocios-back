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
  paisList: Pais[] = [];
  dataList: Partial<Estado>[] = [];
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
    // this.getPaises();
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

        this.dataList = response.data;
        this.totalRecords = response.count;
      });
  }

  // getPaises(): void {
  //   this.paisService.list({all: true}).subscribe((paises: any) => {
  //     this.paisList = paises.data;
  //     this.transformedPaisList = this.paisList.map(pais => ({
  //       label: pais.nombre,
  //       value: pais.id
  //     }));
  //   });
  // }

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


    const fechaInicioFormateada= form.comunicado.rangoFechaInicio ? this.getFormatFecha(form.comunicado.rangoFechaInicio) : '';
    const fechaFinFormateada= form.comunicado.rangoFechaFin ? this.getFormatFecha(form.comunicado.rangoFechaFin) : '';
    // console.log(`fechaInicioFormateada ${fechaInicioFormateada}`);
    // console.log(`fechaInicioFormateada ${fechaInicioFormateada}`);
    console.log(`fechaInicioFormateada ${fechaInicioFormateada}`);

    this.queryParams = ({...this.queryParams, ...form.comunicado, rangoFechaInicio: fechaInicioFormateada, rangoFechaFin: fechaFinFormateada});
    this.lista();
  }

  getFormatFecha(fecha: Date): string{
    // console.log(`fecha ${fecha}`);
    // Obtener los componentes de la fecha
    const dia = String(fecha.getDate()).padStart(2, '0'); // Día (1-31)
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes (1-12)
    const anio = fecha.getFullYear(); // Año (4 dígitos)

// Formato DDMMYYYY
    const formatoFinal = `${dia}/${mes}/${anio}`;
    console.log(`formatoFinal ${formatoFinal}`);
    return formatoFinal;
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
        form: 'estado',
        fields: [
          [
            {
              name: 'pais',
              label: 'País',
              value: 'pais',
              type: 'select',
              options: this.transformedPaisList,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'clave',
              label: 'Clave',
              value: 'clave',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'nombre',
              label: 'Nombre',
              value: 'nombre',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'descripcion',
              label: 'Descripción',
              value: 'descripcion',
              type: 'text',
            }
          ],
        ]
      }
    ]

    let titleDialog = 'Registrar estado'
    if (data.id) {
      titleDialog = 'Editar estado'
      this.genericoService.setFieldDisabled(fieldForms, 'clave', true)
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
      if (data.id) {
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
