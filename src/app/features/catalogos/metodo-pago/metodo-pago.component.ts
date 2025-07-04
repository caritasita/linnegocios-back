import {Component, OnInit, ViewChild} from '@angular/core';
import {TipoComprobante} from '../../../shared/models/tipo-comprobante';
import {
  Field,
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ColumnasTabla} from '../pais/pais.component';
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
import {MetodoPagoService} from '../../../core/services/metodo-pago.service';

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [
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
  templateUrl: './metodo-pago.component.html',
  styleUrl: './metodo-pago.component.css'
})
export class MetodoPagoComponent implements OnInit {
  dataList: TipoComprobante[] = [];
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
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
  ];
  actions = [
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
    private metodoPagoService: MetodoPagoService,
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
    this.metodoPagoService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((metodosPago: any) => {

        this.dataList = metodosPago.data;
        this.totalRecords = metodosPago.count;
      });
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: 'metodoPago',
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
    this.queryParams = ({...this.queryParams, ...form.metodoPago});
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
        form: 'metodoDePago',
        fields: [
          [
            {
              name: 'clave',
              label: 'Clave',
              value: 'clave',
              type: 'text',
              disabled: false,
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

    let titleDialog = 'Registrar tipo de comprobante'
    if (data.id) {
      titleDialog = 'Editar tipo de comprobante';
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
        this.metodoPagoService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.metodoPagoService.create(result).subscribe((respueta) => {
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

    this.metodoPagoService.delete(objeto.id).subscribe(() => {
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
    this.metodoPagoService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }
}
