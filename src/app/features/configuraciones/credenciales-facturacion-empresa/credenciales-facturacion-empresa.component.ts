import {Component, OnInit, ViewChild} from '@angular/core';
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
import {CredencialesFacturacionEmpresaService} from '../../../core/services/credenciales-facturacion-empresa.service';
import {CrudService} from '../../../core/services/crud.service';
import {UrlServer} from '../../../core/helpers/UrlServer';
import {Empresa} from '../../../shared/models/Empresa';
import {ProveedorFacturacion} from '../../../shared/models/proveedor-facturacion';
import {EmpresaCredencial} from '../../../shared/models/empresa-credencial';
import {hasPermission} from '../../../core/helpers/utilities';
import {permisosEmpresaCredencial} from '../../../core/helpers/permissions.data';

@Component({
  selector: 'app-credenciales-facturacion-empresa',
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
  templateUrl: './credenciales-facturacion-empresa.component.html',
  styleUrl: './credenciales-facturacion-empresa.component.css'
})
export class CredencialesFacturacionEmpresaComponent implements OnInit {
  dataList: Partial<EmpresaCredencial>[] = [];
  totalRecords = 0;
  empresaList: Empresa[] = [];
  proveedorList: ProveedorFacturacion[] = [];
  fieldsFilters!: FieldForm[];
  transformedEmpresaList!: any;
  transformedProveedorList!: any;
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'empresa', valor: 'Empresa', tipo: "texto"},
    {clave: 'datosFacturacion', valor: 'Datos de facturación', tipo: "texto"},
    {clave: 'usuarioRegistro', valor: 'Usuario registró', tipo: "texto"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      hideAction: (item: any) => {
        return hasPermission(permisosEmpresaCredencial.update) || !item.activo
      }
    },
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      callback: (item: any) => this.delete(item),
      hideAction: (item: any) => {
        return hasPermission(permisosEmpresaCredencial.delete) || !item.activo
      }
    },
    {
      name: 'recuperarEliminado',
      icon: "restore_from_trash",
      tooltipText: 'Recuperar registro eliminado',
      callback: (item: any) => this.recoverRegister(item.id),
      hideAction: (item: any) => {
        return hasPermission(permisosEmpresaCredencial.delete) || item.activo
      }
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private credencialesFacturacionEmpresaService: CredencialesFacturacionEmpresaService,
    private crudService: CrudService,
    private genericoService: GenericoService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.lista();
    this.getListaEmpresa();
    this.getListaProveedor();
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.credencialesFacturacionEmpresaService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((response: any) => {

        this.dataList = this.generarTablaPersonalizada(response.data);
        this.totalRecords = response.count;
      });
  }

  // Transformar los datos para la tabla
  generarTablaPersonalizada(data: any): any {
    return data.map((item: any) => ({
      id: item?.id,
      empresa: item?.empresa,
      datosFacturacion: `<b class="fz-title-fila-tabla">Proveedor:</b> ${item.proveedorFacturacion.nombre} <br>
 <b class="fz-title-fila-tabla">Usuario:</b> ${item.usuario} <br>
  <b class="fz-title-fila-tabla">URL:</b> ${item.url}`,
      proveedorFacturacion: item?.proveedorFacturacion,
      usuario: item?.usuario,
      url: item?.url,
      creditos: item?.creditos,
      usuarioRegistro: item?.usuarioRegistro?.nombre ? `${item?.usuarioRegistro.nombre} ${item?.usuarioRegistro.apeidoPaterno} ${item?.usuarioRegistro.apeidoMaterno}` : '---',
      activo: item?.activo,
    }));
  }

  getListaEmpresa() {
    this.crudService.list({all: true}, UrlServer.empresa).subscribe((response: any) => {
      this.empresaList = response.data;
      this.transformedEmpresaList = this.empresaList.map(item => ({
        label: item.nombre,
        value: item.id
      }));
    });
  }

  getListaProveedor() {
    this.crudService.list({}, UrlServer.proveedorFacturacion).subscribe((response: any) => {
      this.proveedorList = response.data || [];
      this.transformedProveedorList = this.proveedorList.map(item => ({
        label: item.nombre,
        value: item.id
      }));
    });
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: 'credencialesFacturacionEmpresa',
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
    this.queryParams = ({...this.queryParams, ...form.credencialesFacturacionEmpresa});
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
        form: 'empresaCredencial',
        fields: [
          [
            {
              name: 'empresa',
              label: 'Empresa',
              type: 'select',
              options: this.transformedEmpresaList,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'usuario',
              label: 'Usuario facturación',
              value: 'usuario',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'password',
              label: 'Contraseña facturación',
              value: 'password',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'url',
              label: 'URL facturación',
              value: 'url',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'proveedorFacturacion',
              label: 'Proveedor',
              type: 'select',
              options: this.transformedProveedorList,
              validation: Validators.required
            }
          ]
        ]
      }
    ]

    let titleDialog = 'Registrar credenciales de facturación';
    if (data.id) {
      titleDialog = 'Editar credenciales de facturación';
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
        this.credencialesFacturacionEmpresaService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.credencialesFacturacionEmpresaService.create(result).subscribe((respueta) => {
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

    this.credencialesFacturacionEmpresaService.delete(objeto.id).subscribe(() => {
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
    this.credencialesFacturacionEmpresaService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }

}
