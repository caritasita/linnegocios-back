import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {DatePipe, NgIf} from '@angular/common';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {Field, FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ColumnasTabla} from '../../catalogos/pais/pais.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {Negocio} from '../../../shared/models/negocio';
import {NegocioService} from '../../../core/services/negocio.service';
import {Estado} from '../../../shared/models/Estado';
import {CrudService} from '../../../core/services/crud.service';
import {UrlServer} from '../../../core/helpers/UrlServer';
import {GiroComercial} from '../../../shared/models/GiroComercial';

@Component({
  selector: 'app-negocio',
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
  ],
  templateUrl: './negocio.component.html',
  styleUrl: './negocio.component.scss',
})
export class NegocioComponent implements OnInit {
  dataList: Partial<Negocio>[] = [];
  estadosList: Partial<Estado>[] = [];
  giroComercialList: GiroComercial[] = [];

  totalRecords = 0;
  fieldsFilters!: Field[];
  transformedEstadoList!: any;
  transformedGiroComercialList!: any;
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'datosContacto', valor: 'Datos de contacto', tipo: "texto"},
    {clave: 'informacionNegocio', valor: 'Información del negocio', tipo: "texto"},
    {clave: 'seguimiento', valor: 'Seguimiento', tipo: "texto"},
    // {clave: 'autopago', valor: 'Autopago', tipo: "texto"},
  ];
  actions = [
    {
      name: 'Editar',
      icon: "key",
      tooltipText: 'Credenciales electrónicas',
      hideIcon: false,
      callback: (item: any) => this.activarCredencialElectrnico(item)
    },
    {
      name: 'Editar',
      icon: "edit_calendar",
      tooltipText: 'Registrar seguimiento',
      callback: (item: any) => this.openFormDialog(item)
    },
    {
      name: 'Reiniciar negocio',
      icon: "history_2",
      tooltipText: 'Reiniciar negocio',
      callback: (item: any) => this.resetBusiness(item)
    },
    {
      name: 'Editar',
      icon: "more_time",
      tooltipText: 'Cambiar tipo de licencia',
      callback: (item: any) => this.promoteLicence(item)
    },
    {
      name: 'Editar',
      icon: "list_alt",
      tooltipText: 'Log asignación agente',
      callback: (item: any) => this.openFormDialog(item)
    },
    {
      name: 'Editar',
      icon: "person_search",
      tooltipText: 'Buscar agente',
      callback: (item: any) => this.openFormDialog(item)
    },
    {name: 'Editar', icon: "edit", tooltipText: 'Editar', callback: (item: any) => this.openFormDialog(item)},
    {name: 'Eliminar', icon: "delete", tooltipText: 'Eliminar', callback: (item: any) => this.delete(item)},
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private negocioService: NegocioService,
    private genericoService: GenericoService,
    private crudService: CrudService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.lista();
    this.getEstados(null);
    this.getGiroComercial();
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.negocioService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((response: any) => {
        console.log('response.data');
        this.dataList = this.generarTablaPersonalizada(response.data);
        console.table(this.dataList);
        this.totalRecords = response.count;
      });
  }

  // Transformar los datos para la tabla
  generarTablaPersonalizada(data: any): any {
    return data.map((item: any) => ({
      id: item?.id,
      datosContacto: ` <br>
<b class="fz-title-fila-tabla">ID:</b> ${item.id || '---'} <b class="fz-title-fila-tabla ml-3"">ID TAE:</b> ${item.idLinntae || '---'} <br>
<b class="fz-title-fila-tabla">Nombre:</b> ${item.nombre} <br>
<b class="fz-title-fila-tabla">Teléfono:</b> ${item.telefono} <br>
<b class="fz-title-fila-tabla">Correo:</b> ${item.email}<br>
<b class="fz-title-fila-tabla">Entorno:</b> ${item.tipo || '---'}<br>
<b class="fz-title-fila-tabla">Dispositivo:</b> ${item.dispositivo ? item.dispositivo.modelo : '---'}<br>
<b class="fz-title-fila-tabla">Licencia:</b> ${item.licencia.tipoLicencia || '---'} <b class="fz-title-fila-tabla ml-3"">Plan:</b> ${item.licencia.tipoLicenciaPrueba || '---'} <br>
<b class="fz-title-fila-tabla">¿Distribución activa?:</b> ${item.distribucionActiva ? 'SI' : 'NO'}<br> <br>
`,
      informacionNegocio: `<br>
<b class="fz-title-fila-tabla">F. registro: </b> ${this.genericoService.getFormatedDateTime(item.licencia.fechaCreacion)}<br>
<b class="fz-title-fila-tabla">F. vigencia: </b> ${this.genericoService.getFormatedDateTime(item.licencia.fechaLimitePago)} <br>
<b class="fz-title-fila-tabla">F. verificación: </b> ${this.genericoService.getFormatedDateTime(item.fechaVerificacion) || '---'}<br>
<b class="fz-title-fila-tabla">F. última venta: </b>${item.fechaUltimaVenta ? this.genericoService.getFormatedDateTime(item.fechaUltimaVenta) : '---'}<br>
<b class="fz-title-fila-tabla">Estatus:</b> <span> ${item.activo ? 'Activo' : 'Eliminado'}</span>
<b class="fz-title-fila-tabla ml-2">Verificado:</b> <span>${item.fechaVerificacion ? 'SI' : 'NO'}</span><br>
<b class="fz-title-fila-tabla">D. facturación:</b> <span> ${item.datosFacturaNegocio ? 'SI' : 'NO'}</span> <br>
<b class="fz-title-fila-tabla">Días sin venta:</b> <span>${item.fechaUltimaVenta ? item.diasSinVenta : '---'}</span><br>
<b class="fz-title-fila-tabla">Inventario:</b><span>${item.conteoInventarios > 0 ? 'SI' : 'NO'}</span>
<b class="fz-title-fila-tabla ml-2">Cant. Regis.:</b><span>${item.conteoInventarios || 0}</span><br>
<b class="fz-title-fila-tabla">Giro:</b> ${item.giroComercial[0]?.nombre || '---'}<br><br>
`,
      seguimiento: `<br>
<b class="fz-title-fila-tabla">Agente:</b> ${item.agente.nombre ? item.agente.nombre + item.agente.apeidoPaterno + item.agente.apeidoMaterno : '---'}<br>
<b class="fz-title-fila-tabla">Existe seguimiento:</b><span> ${item.existSeguimiento ? 'Si' : 'No'}</span><br>
<b class="fz-title-fila-tabla">Último seguimiento:</b><br>
${item.ultimoSeguimiento ? item.ultimoSeguimiento.estatusSeguimiento.nombre : '---'}<br>
<b class="fz-title-fila-tabla">Último comentario:</b><br>
<div class="size-comentario-tabla">${item.ultimoSeguimiento ? item.ultimoSeguimiento.mensaje : '---'}</div><br>
        `,
      ...data[0],
    }));
  }

  getEstados(paisId: any) {
    this.estadosList = [];
    this.crudService
      .list({pais: paisId, all: true}, UrlServer.estado)
      .subscribe((response: any) => {
        this.estadosList = response.data;
        this.transformedEstadoList = this.estadosList.map(item => ({
          label: item.nombre,
          value: item.id
        }));
      });
  }

  getGiroComercial() {
    this.crudService.list({all: true}, UrlServer.giroComercial).subscribe((response: any) => {
      this.giroComercialList = response.data;
      this.transformedGiroComercialList = this.giroComercialList.map(item => ({
        label: item.nombre,
        value: item.id
      }));
    });
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

    const fields: Field[][] = [
      [
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          validation: Validators.required
        }
      ],
      [
        {
          name: 'giroComercial',
          label: 'Giro comercial',
          type: 'select',
          options: this.transformedGiroComercialList,
          validation: Validators.required
        }
      ],
      [
        {
          name: 'telefono',
          label: 'Telefono',
          type: 'text',
          validation: Validators.required
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          validation: Validators.required
        }
      ],
      [
        {
          name: 'cp',
          label: 'Código postal',
          type: 'text',
          validation: Validators.required
        },
        {
          name: 'estado',
          label: 'Estado',
          type: 'select',
          options: this.transformedEstadoList,
          validation: Validators.required
        }
      ],
      [
        {
          name: 'comisionRecargas',
          label: 'Comisión recargas',
          type: 'number',
          validation: Validators.required
        }
      ],
      [
        {
          name: 'activo',
          label: 'Activar distribución',
          type: 'toggle',
        }
      ],

    ]

    let titleDialog = 'Registrar negocio'
    if (data.id) {
      titleDialog = 'Editar negocio'
    }

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fields,
        data
      },
      disableClose: true,
      minWidth: '50vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {
      if (data.id) {
        result = ({...result, id: data.id})
        this.negocioService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.negocioService.create(result).subscribe((respueta) => {
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

    this.negocioService.delete(objeto.id).subscribe(() => {
      this.lista();
      this.genericoService.openSnackBar('Registro eliminado exitosamente', 'Aceptar', 'snack-bar-success', () => {
      });
    });
  }

  private async activarCredencialElectrnico(negocio: Negocio) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Está seguro de restablecer las credenciales del negocio?'
    );
    if (!isConfirmed) {
      return;
    }
    this.crudService
      .update({id: negocio.idLinntae, idNegocio: negocio.id}, UrlServer.resetearCredencialesTae)
      .subscribe(() => {
        // this.resetOffset();
      });
  }

  private async resetBusiness(negocio: Negocio) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Está seguro de reiniciar el negocio? \n (Esta acción eliminara todo lo relacionado al negocio)'
    );
    if (!isConfirmed) {
      return;
    }
    this.crudService
      .update({id: negocio.id}, UrlServer.resetearNegocio)
      .subscribe(() => {
        this.genericoService.openSnackBar('Negocio reiniciado exitosamente.', 'Aceptar', 'snack-bar-success', () => {
        });
        // this.resetOffset();
      });
  }

  private promoteLicence(negocio: Negocio) {

    const isConfirmed = this.genericoService.confirmDialog(
      '¿Promover a licencia de tipo Soporte?'
    );
    if (!isConfirmed) {
      return;
    }
    this.crudService.updateById({id: negocio.id}, UrlServer.promoteLicence).subscribe((response) => {
      this.genericoService.openSnackBar(response.mensaje, 'Aceptar', 'snack-bar-success', () => {});
        // this.resetOffset();
    });
  }
}
