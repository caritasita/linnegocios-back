import {Component, OnInit, ViewChild} from '@angular/core';
import {
  Field,
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {ConfiguracionCaja} from '../../../shared/models/ConfiguracionCaja';
import {ConfiguracionCajaService} from '../../../core/services/configuracion-caja.service';
import {CrudService} from '../../../core/services/crud.service';
import {hasPermission} from '../../../core/helpers/utilities';
import {permisosConfiguracionCaja} from '../../../core/helpers/permissions.data';

@Component({
  selector: 'app-configuracion-caja',
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
  templateUrl: './configuracion-caja.component.html',
  styleUrl: './configuracion-caja.component.css'
})
export class ConfiguracionCajaComponent implements OnInit {
  dataList: Partial<ConfiguracionCaja>[] = [];
  totalRecords = 0;
  fieldsFilters!: Field[];
  listaTipoLicencia: any = [];

  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'tipoLicencia', valor: 'Tipo de licencia', tipo: "texto"},
    {clave: 'costoCajaRango', valor: 'Costo', tipo: "moneda"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      hideAction: (item: any) => {
        return hasPermission(permisosConfiguracionCaja.update) || !item.activo
      }
    },
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      callback: (item: any) => this.delete(item),
      hideAction: (item: any) => {
        return hasPermission(permisosConfiguracionCaja.delete) || !item.activo
      }
    },
    {
      name: 'recuperarEliminado',
      icon: "restore_from_trash",
      tooltipText: 'Recuperar registro eliminado',
      callback: (item: any) => this.recoverRegister(item.id),
      hideAction: (item: any) => {
        return hasPermission(permisosConfiguracionCaja.reactivar) || item.activo
      }
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private configuracionCajaService: ConfiguracionCajaService,
    private genericoService: GenericoService,
    private crudService: CrudService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.lista();
    this.getTiposDeLicencia()
  }

  getTiposDeLicencia() {
    this.crudService
      .list({ all: true }, 'catalogo/tiposLicencias')
      .subscribe((response) => {
        this.listaTipoLicencia = response.filter((key) => {
          return key !== 'DEMO' && key !== 'PORTABLE' && key !== 'GRATIS_MOVIL';
        });

        this.listaTipoLicencia = this.listaTipoLicencia.map((item: any) => ({
          label: item,
          value: item
        }));
      });
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.configuracionCajaService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((estados: any) => {

        this.dataList = estados.data;
        this.totalRecords = estados.count;
      });
  }

  formFiltros(): void {
    this.fieldsFilters = [
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
        form: 'configuracionCaja',
        fields: [
          [
            {
              name: 'tipoLicencia',
              label: 'Tipo de licencia',
              type: 'select',
              options: this.listaTipoLicencia,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'costoCajaRango',
              label: 'Precio',
              value: 'costoCajaRango',
              type: 'text',
              validation: Validators.required
            }
          ]
        ]
      }

    ]

    let titleDialog = 'Registrar configuración caja'
    if (data.id) {
      titleDialog = 'Editar configuración caja'
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
        this.configuracionCajaService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.configuracionCajaService.create(result).subscribe((respueta) => {
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

    this.configuracionCajaService.delete(objeto.id).subscribe(() => {
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
    this.configuracionCajaService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }

}

