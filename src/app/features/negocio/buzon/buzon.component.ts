import {Component, OnInit, ViewChild} from '@angular/core';
import {Marketing} from '../../../shared/models/Marketing';
import {
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {PublicidadService} from '../../../core/services/publicidad.service';
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
import {Buzon} from '../../../shared/models/Buzon';
import {first, Subject, Subscription} from 'rxjs';
import {FirestoreModule} from '@angular/fire/firestore';

@Component({
  selector: 'app-buzon',
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
    TablaGenericaComponent,
    FirestoreModule,
  ],
  templateUrl: './buzon.component.html',
  styleUrl: './buzon.component.css',
  providers: [BuzonService]
})
export class BuzonComponent implements OnInit {
  dataList: Partial<Buzon>[] = [];
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
    // {clave: 'id', valor: 'ID', tipo: "text"},
    {clave: 'datosContacto', valor: 'Datos de contacto', tipo: "text"},
    {clave: 'datosBuzon', valor: 'Datos buzón', tipo: "texto"},
    {clave: 'ultimoSeguimiento', valor: 'Último seguimiento', tipo: "texto"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Cerrar buzón',
      icon: "close",
      tooltipText: 'Cerrar buzón',
      callback: (item: any) => this.cerrarBuzon(item),
      // hideAction: (item: any) => {
      //   if(item.activo) {
      //     return !item.activo
      //   }
      //   return true
      // }
    },
    {
      name: 'Abrir seguimiento',
      icon: "edit",
      tooltipText: 'Abrir seguimiento',
      callback: (item: any) => this.abrirSeguimiento(item),
      // hideAction: (item: any) => {
      //   if(item.activo) {
      //     return !item.activo
      //   }
      //   return true
      // }
    },
    // {
    //   name: 'Recuperar eliminado',
    //   icon: "restore_from_trash",
    //   tooltipText: 'Recuperar registro eliminado',
    //   callback: (item: any) => this.recoverRegister(item.id),
    //   hideAction: (item: any) => {
    //     if(!item.activo) {
    //       return item.activo
    //     }
    //     return true
    //   }
    // }
  ];

  public buzonSub$!: Subscription;
  public buzon$ = new Subject<any>();

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private buzonService: BuzonService,
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
      <b class="fz-title-fila-tabla">Fecha:</b> ${item?.fecha} <br>
      <b class="fz-title-fila-tabla">Mensaje:</b> ${item?.mensaje} <br>
      <b class="fz-title-fila-tabla">Estatus:</b> ${item.estatus} <br>
      `,
      ultimoSeguimiento: item?.ultimoSeguimiento,
    }));
  }


  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: "publicidad",
        fields: [
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

  abrirSeguimiento(data: any) {

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
