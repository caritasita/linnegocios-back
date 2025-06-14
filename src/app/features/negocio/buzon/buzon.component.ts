import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {BuzonService} from '../../../core/services/buzon.service';
import {Buzon} from '../../../shared/models/Buzon';
import {first, Subject, Subscription} from 'rxjs';
import {FirestoreModule} from '@angular/fire/firestore';
import {EstatusSeguimientoNegocioService} from '../../../core/services/estatus-seguimiento-negocio.service';
import {EstatusSeguimientoNegocio} from '../../../shared/models/estatusSeguimientoNegocio';
import {SeguimientoNegocioComponent} from '../seguimiento-negocio/seguimiento-negocio.component';

@Component({
  selector: 'app-buzon',
  standalone: true,
  imports: [
    FormDialogGenericoComponent,
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
    MatButton,
    SeguimientoNegocioComponent,
  ],
  templateUrl: './buzon.component.html',
  styleUrl: './buzon.component.css',
  providers: [BuzonService]
})
export class BuzonComponent implements OnInit {
  dataList: Partial<Buzon>[] = [];
  totalRecords = 0;
  fieldsFilters!: FieldForm[];
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    // {clave: 'id', valor: 'ID', tipo: "text"},
    {clave: 'datosContacto', valor: 'Datos de contacto', tipo: "text"},
    {clave: 'datosBuzon', valor: 'Datos buzón', tipo: "texto"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Cerrar buzón',
      icon: "delete_forever",
      tooltipText: 'Cerrar buzón',
      callback: (item: any) => this.cerrarBuzon(item),
    },
    {
      name: 'Abrir seguimiento',
      icon: "directions_walk",
      tooltipText: 'Abrir seguimiento',
      callback: (item: any) => this.openSeguimientoNegocio(item.negocio),
    },
  ];

  estatusSeguimientoList: EstatusSeguimientoNegocio[] = [];
  transformedEstatusSeguimientoList!: any;

  listEstatusBuzon = LIST_ESTATUS_BUZON;

  public buzonSub$!: Subscription;
  public buzon$ = new Subject<any>();

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;
  @ViewChild('seguimientoDrawer') drawerSeguimientoNegocio!: MatDrawer;

  constructor(
    private buzonService: BuzonService,
    private genericoService: GenericoService,
    private estatusSeguimientoNegocioService: EstatusSeguimientoNegocioService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.lista();
    this.getEstatusSeguimiento();
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }

    this.buzon$.asObservable().subscribe(() => {

      this.buzonSub$ = this.buzonService
        .list({
          ...this.queryParams,
          registrosActivos: !this.queryParams.registrosEliminados,
        })
        .subscribe((response: any) => {
          this.dataList = this.generarTablaPersonalizada(response.data);
          this.totalRecords = response.count;
          console.table(this.dataList)

        });
    });
    this.buzon$.next(null);
  }

  generarTablaPersonalizada(data: any): any {
    return data.map((item: any, index: number) => ({
      ...data[index],
      id: item?.id,
      datosContacto: `
      <br>
      <b class="fz-title-fila-tabla">Negocio:</b> ${item.negocio.id} - ${item.negocio.nombre} <br>
      <b class="fz-title-fila-tabla">Cajero:</b> ${item?.usuarioPDV.nombre} ${item?.usuarioPDV.apeidoPaterno} <br>
      <b class="fz-title-fila-tabla">Teléfono:</b> ${item.telefono} <br>
      <b class="fz-title-fila-tabla">Correo:</b> ${item.correo} <br>
      <br>
      `,
      datosBuzon: `
      <b class="fz-title-fila-tabla">Fecha:</b> ${this.genericoService.getFormatedDateTime(item.fecha)} <br>
      <b class="fz-title-fila-tabla">Estatus:</b> ${item.estatus} <br>
      <b class="fz-title-fila-tabla">Último seguimiento:</b> ${item?.ultimoSeguimiento || '---'} <br>
      <b class="fz-title-fila-tabla">Mensaje:</b> <div class="acortar-comentario-en-tabla" data-ancho-texto-static="600">${item?.mensaje}</div> <br>
      `,
    }));
  }

  private getEstatusSeguimiento() {
    this.estatusSeguimientoNegocioService.list({all: true}).subscribe((response: any) => {
      this.estatusSeguimientoList= response.data;
      this.transformedEstatusSeguimientoList = this.estatusSeguimientoList.map((es: any) => {
        return {
          label: es.nombre,
          value: `${es.id}(${es.isLeadBasura})`
        }
      } );
    });
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: "publicidad",
        fields: [
          [
            {
              name: 'fechaRegistroInicio',
              label: 'Fecha inicio',
              type: 'datepicker',
            },
          ],
          [
            {
              name: 'fechaRegistroFin',
              label: 'Fecha fin',
              type: 'datepicker',
            },
          ],
          [
            {
              name: 'estatus',
              label: 'Estatus',
              value: 'estatus',
              options: this.listEstatusBuzon,
              type: 'select',
            },
          ],
          [
            {
              name: 'estatusSeguimiento',
              label: 'Estatus de seguimiento',
              value: 'estatusSeguimiento',
              options: this.transformedEstatusSeguimientoList,
              type: 'select',
            },
          ]

        ]
      }

    ]
  }

  procesarfiltros(form: any) {
    this.queryParams = ({...this.queryParams, ...form.publicidad});
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

  async cerrarBuzon(data: any) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Seguro que desea cerrar el buzón?'
    );
    if (!isConfirmed) {
      return;
    }

    const payload = {
      id: data.id,
      status: 'cerrado',
    };

    this.buzonService
      .update(payload)
      .pipe(first())
      .subscribe(() => this.buzon$.next(null));

  }

  openSeguimientoNegocio(negocio: any){
    this.drawerSeguimientoNegocio.open(negocio?.id);
  }
  // openFormDialog(data: any = {}) {
  //
  //   const fieldForms: FieldForm[] = [
  //     {
  //       form: 'publicidad',
  //       fields: [
  //         [
  //           {
  //             name: 'imagen',
  //             label: 'Imágen',
  //             value: 'imagen',
  //             type: 'file',
  //             validation: Validators.required
  //           }
  //         ],
  //         [
  //           {
  //             name: 'descripcion',
  //             label: 'Descripción',
  //             value: 'descripcion',
  //             type: 'text',
  //           }
  //         ],
  //       ]
  //     }
  //   ]
  //
  //   let titleDialog = 'Registrar publicidad'
  //   if (data.id) {
  //     titleDialog = 'Editar publicidad'
  //     this.genericoService.setFieldDisabled(fieldForms, 'clave', true)
  //   }
  //
  //   const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
  //     data: {
  //       titleDialog: titleDialog,
  //       fieldForms,
  //       data
  //     },
  //     disableClose: true,
  //     width: '50vw',
  //   });
  //
  //   dialogRef.componentInstance.submitForm.subscribe(result => {
  //     result= result.publicidad;
  //     result.imagen = result?.imagen?.nombre ? result?.imagen : null;
  //
  //     if (data.id) {
  //       result = ({...result, id: data.id})
  //       this.buzonService.update(result).subscribe((respueta) => {
  //         if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
  //         });
  //         this.lista();
  //       });
  //     }
  //     else {
  //       this.buzonService.create(result).subscribe((respueta) => {
  //         if (respueta) this.genericoService.openSnackBar('Registro creado exitosamente', 'Aceptar', 'snack-bar-success', () => {
  //         });
  //         this.lista();
  //       });
  //     }
  //     dialogRef.close();
  //   });
  // }

  // private async delete(objeto: any) {
  //   const isConfirmed = await this.genericoService.confirmDialog(
  //     '¿Está seguro de eliminar el registro?'
  //   );
  //   if (!isConfirmed) {
  //     return;
  //   }
  //
  //   this.buzonService.delete(objeto.id).subscribe(() => {
  //     this.lista();
  //   });
  // }

  // private async recoverRegister(id: number) {
  //   const isConfirmed = await this.genericoService.confirmDialog(
  //     '¿Está seguro de recuperar el registro?'
  //   );
  //   if (!isConfirmed) {
  //     return;
  //   }
  //   this.publicidadService.reactivate(id).subscribe(() => {
  //     this.lista(true);
  //   });
  // }

}

const LIST_ESTATUS_BUZON = [
  { label: 'NUEVO', value: 'Buzón nuevo' },
  { label: 'EN_SEGUIMIENTO', value: 'Buzón en seguimiento' },
  { label: 'CERRADO', value: 'Buzón cerrado' },
];
