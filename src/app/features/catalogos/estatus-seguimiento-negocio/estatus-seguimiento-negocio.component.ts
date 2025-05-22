import {Component, OnInit, ViewChild} from '@angular/core';
import {
  Field,
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {PaisService} from '../../../core/services/pais.service';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {ActionsTabla, ColumnasTabla} from '../pais/pais.component';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {EstatusSeguimientoNegocioService} from '../../../core/services/estatus-seguimiento-negocio.service';

@Component({
  selector: 'app-estatus-seguimiento-negocio',
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
    TablaGenericaComponent
  ],
  templateUrl: './estatus-seguimiento-negocio.component.html',
  styleUrl: './estatus-seguimiento-negocio.component.css'
})
export class EstatusSeguimientoNegocioComponent implements OnInit {
  dataList: any[] = [];
  totalRecords: number = 0;
  fieldsFilters!: Field[];
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
    {clave: 'usuarioRegistro', valor: 'Usuario registró', tipo: "texto"},
    {clave: 'usuarioActualizo', valor: 'Usuario actualizó', tipo: "texto"},
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
      name: 'recuperarEliminado',
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
    private estatusSeguimientoNegocioService: EstatusSeguimientoNegocioService,
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
    this.estatusSeguimientoNegocioService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((response: any) => {
        this.dataList = this.generarTablaPersonalizada(response.data);
        this.totalRecords = response.count;
        console.table(this.dataList)
      });
  }

  // Transformar los datos para la tabla
  generarTablaPersonalizada(data: any): any {
    return data.map((item: any) => ({
      id: item?.id,
      fechaRegistro: item?.fechaRegistro,
      clave: item?.clave,
      nombre: item?.nombre,
      descripcion: item?.descripcion,
      usuarioRegistro: item?.usuarioRegistro?.nombre ? `${item?.usuarioRegistro.nombre} ${item?.usuarioRegistro.apeidoPaterno} ${item?.usuarioRegistro.apeidoMaterno}` : '---',
      usuarioActualizo: item?.usuarioActualizo?.nombre ? `${item?.usuarioActualizo?.nombre || ''} ${item?.usuarioActualizo?.apeidoPaterno || ''} ${item?.usuarioActualizo?.apeidoMaterno || ''}` : '---',
      isLeadBasura: item?.isLeadBasura,
      activo: item?.activo,
    }));
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        name: 'filtroGeneral',
        label: 'Clave / Nombre',
        type: 'text',
      },
      {
        name: 'registrosEliminados',
        label: 'Ver eliminados',
        type: 'toggle',
      },
    ]
  }

  procesarfiltros(form: any) {
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

  openFormDialog(data: any = {}) {

    const fieldForms: FieldForm[] = [
      {
        form: 'estatusSeguimientoNegocio',
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
          [
            {
              name: 'isLeadBasura',
              label: 'Activa la opción si el estatus se usará para negocios que serán tomados como leads basura',
              value: 'isLeadBasura',
              type: 'toggle'
            }
          ]
        ]
      }
    ]

    let titleDialog = 'Registrar estatus seguimiento del negocio'
    if (data.id) {
      titleDialog = 'Editar estatus seguimiento del negocio';
      this.genericoService.setFieldDisabled(fieldForms, 'clave', true)
    }

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fieldForms,
        data
      },
      disableClose: true,
      width: '60vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {

      if (data.id) {
        result = ({...result, id: data.id})
        this.estatusSeguimientoNegocioService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.estatusSeguimientoNegocioService.create(result).subscribe((respueta) => {
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

    this.estatusSeguimientoNegocioService.delete(objeto.id).subscribe(() => {
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
    this.estatusSeguimientoNegocioService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }
}
