import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {DatePipe, NgIf} from '@angular/common';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {
  Field,
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {Negocio} from '../../../shared/models/negocio';
import {NegocioService} from '../../../core/services/negocio.service';
import {Estado} from '../../../shared/models/Estado';
import {CrudService} from '../../../core/services/crud.service';
import {UrlServer} from '../../../core/helpers/UrlServer';
import {GiroComercial} from '../../../shared/models/GiroComercial';
import {hasPermission} from '../../../core/helpers/utilities';
import {permisosCredencialElectronico} from '../../../core/helpers/permissions.data';
import {ValidationMessagesService} from '../../../core/services/validation-messages.service';
import {ListaGenericaComponent} from '../../../shared/lista-generica/lista-generica.component';
import {LogMovimientosLicencia} from '../../../shared/models/logMovimientosLicencia';
import {firstValueFrom} from 'rxjs';

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
    FormDialogGenericoComponent,
  ],
  templateUrl: './negocio.component.html',
  styleUrl: './negocio.component.scss',
})
export class NegocioComponent implements OnInit {
  dataList: Partial<Negocio>[] = [];
  estadosList: Partial<Estado>[] = [];
  giroComercialList: GiroComercial[] = [];
  logsList: LogMovimientosLicencia[] = [];

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
  actions: ActionsTabla[] = [
    {
      name: 'Credenciales electrónicas',
      icon: "key",
      tooltipText: 'Credenciales electrónicas',
      callback: (item: any) => this.activarCredencialElectrnico(item),
      hideAction: (item: any) => {
        if (item.idLinntae) {
          return item.activo && item.idLinntae
            ? hasPermission(permisosCredencialElectronico.update)
            : hasPermission(permisosCredencialElectronico.save);
        }
        return true;
      },
    },
    {
      name: 'Asignar ID TAE',
      icon: "key",
      tooltipText: 'Asignar ID TAE',
      hideAction: (item: any) => {
        if (!item.idLinntae) {
          return hasPermission(permisosCredencialElectronico.save);
        }
        return true;
      },
      callback: (item: any) => this.asignarIdTae(item)
    },
    {
      name: 'Registrar seguimiento',
      icon: "edit_calendar",
      tooltipText: 'Registrar seguimiento',
      hideAction: (item: any) => {
        return false;
      },
      callback: (item: any) => this.openSeguimientoNegocio(item)
    },
    {
      name: 'Reiniciar negocio',
      icon: "history_2",
      tooltipText: 'Reiniciar negocio',
      hideAction: (item: any) => {
        return false;
      },
      callback: (item: any) => this.resetBusiness(item)
    },
    {
      name: 'Aumentar días liencia demo',
      icon: "more_time",
      tooltipText: 'Aumentar días licencia demo',
      hideAction: (item: any) => {
        return false;
      },
      callback: (item: any) => this.increaseLicence(item)
    },
    {
      name: 'Cambiar tipo de licencia',
      icon: "workspace_premium",
      tooltipText: 'Cambiar tipo de licencia',
      hideAction: (item: any) => {
        return false;
      },
      callback: (item: any) => this.promoteLicence(item)
    },
    {
      name: 'Log de asignación de agente',
      icon: "list_alt",
      tooltipText: 'Log asignación agente',
      hideAction: (item: any) => {
        return false;
      },
      callback: (item: any) => this.openFormDialog(item)
    },
    {
      name: 'Buscar agente',
      icon: "person_search",
      tooltipText: 'Buscar agente',
      hideAction: (item: any) => {
        return false;
      },
      callback: (item: any) => this.openFormDialog(item)
    },
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      hideAction: (item: any) => {
        return false;
      },
      callback: (item: any) => this.openFormDialog(item)
    },
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      hideAction: (item: any) => {
        return false;
      },
      callback: (item: any) => this.delete(item)
    },
  ];

  fieldFormSeguimiento!: FieldForm[];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;
  @ViewChild('drawerSeguimientoNegocio') drawerSeguimientoNegocio!: MatDrawer;

  constructor(
    private negocioService: NegocioService,
    private genericoService: GenericoService,
    private crudService: CrudService,
    private dialog: MatDialog,
    private validationMessagesService: ValidationMessagesService,
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
        this.dataList = this.generarTablaPersonalizada(response.data);
        this.totalRecords = response.count;
      });
  }

  // Transformar los datos para la tabla
  generarTablaPersonalizada(data: any): any {
    return data.map((item: any, index: number) => ({
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
      ...data[index],
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

    let fieldForms: FieldForm[] = [
      {
        form: 'negocio',
        fields: [
          [
            {
              name: 'nombre',
              label: 'Nombre del negocio',
              value: 'nombre',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'giroComercial',
              label: 'Giro comercial',
              value: 'giroComercial',
              type: 'multiselect',
              options: this.transformedGiroComercialList,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'telefono',
              label: 'Telefono',
              value: 'telefono',
              type: 'tel',
              maxLenght: 10,
              validation: Validators.compose([Validators.required, this.validationMessagesService.telefonoValido()]),

            },
            {
              name: 'email',
              label: 'Email',
              value: 'email',
              type: 'email',
              validation: Validators.compose([Validators.required, Validators.email])
            }
          ],
          [
            {
              name: 'cp',
              label: 'Código postal',
              value: 'cp',
              type: 'text',
              minLength: 4,
              maxLenght: 6,
              validation: Validators.compose(
                [
                  Validators.required,
                  this.validationMessagesService.soloNumeros(),
                  Validators.minLength(4),
                  Validators.maxLength(6)
                ]
              )
            },
            {
              name: 'estado',
              label: 'Estado',
              value: 'estado',
              type: 'select',
              options: this.transformedEstadoList,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'comisionRecargas',
              label: 'Comisión recargas',
              value: 'comisionRecargas',
              type: 'number',
              disabled: true,
              validation: Validators.required
            }
          ]
        ]
      },
      {
        form: 'configuracionDistribucion',
        fields: [
          [
            {
              name: 'activo',
              label: 'Activar distribución',
              value: 'configuracionDistribucion.activo',
              type: 'toggle',
            },
          ],
          [
            {
              name: 'comision',
              label: 'Comisión por distribución',
              value: 'configuracionDistribucion.comision',
              dependsOn: 'configuracionDistribucion.activo',
              type: 'number',
              validation: Validators.compose([this.validationMessagesService.soloNumeros])
            },
          ]
        ]
      },
      {
        form: 'tendero',
        fields: [
          [
            {
              name: 'nombre',
              label: 'Nombre del tendero',
              value: 'nombre',
              type: 'text',
              validation: Validators.required
            },
            {
              name: 'apeidoPaterno',
              label: 'Apellido paterno',
              value: 'apeidoPaterno',
              type: 'text',
              validation: Validators.required
            },
            {
              name: 'apeidoMaterno',
              label: 'Apellido materno',
              value: 'apeidoMaterno',
              type: 'text',
            },
          ],
        ]
      }
    ]

    let titleDialog = 'Registrar negocio'
    data.comisionRecargas = 6;
    if (data.id) {
      titleDialog = 'Editar negocio'
      //Se quitan del json los campos que forman parte del tendero
      fieldForms = fieldForms.filter(ff => ff.form !== 'tendero')
    }

    // console.log('data');
    // console.table(data);

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fieldForms,
        data
      },
      disableClose: true,
      minWidth: '50vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {

      /*Quitamos configuracionDistribucion de raíz y lo agregamos a nivel negocio, ya que así es como lo recive de lado del back*/
      result.negocio.configuracionDistribucion = result.configuracionDistribucion;
      delete result.configuracionDistribucion;

      if (data.id) {
        result = ({...result, id: data.id})
        this.negocioService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
          dialogRef.close();
        });
      } else {

        result.id = data.id
        result.tendero.username = result.negocio.telefono
        result.tendero.telefono = result.negocio.telefono
        result = ({...result})

        this.negocioService.create(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro creado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
          dialogRef.close();
        });
      }
    });
  }

  openSeguimientoNegocio(data: Negocio) {
    this.drawerSeguimientoNegocio.open()

    this.fieldFormSeguimiento = [
      {
        form: 'negocio',
        fields: [
          [
            {
              name: 'tipoSeguimiento',
              label: 'Tipo de seguimiento',
              value: 'tipoSeguimiento',
              type: 'select',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'estatusSeguimiento',
              label: 'Estatus de seguimiento',
              value: 'estatusSeguimiento',
              type: 'select',
              options: this.transformedGiroComercialList,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'mensaje',
              label: 'Mensaje',
              value: 'mensaje',
              type: 'text',
              maxLenght: 10,
              validation: Validators.compose([Validators.required, this.validationMessagesService.telefonoValido()]),

            }
          ],
        ]
      },
    ]

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

  private async asignarIdTae(negocio: Negocio) {

    const fieldForms: FieldForm[] = [
      {
        form: 'asignarIdTae',
        fields: [
          [
            {
              name: 'idTae',
              label: 'ID de linntae',
              type: 'text',
              validation: Validators.compose([Validators.required, this.validationMessagesService.soloNumeros()])
            }
          ],
        ]
      }
    ];

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: 'Registrar ID de Linntae',
        fieldForms,
      },
      disableClose: true,
      minWidth: '30vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(async result => { // Cambiado a async

      const isConfirmed = await this.genericoService.confirmDialog( // Se agrega await
        `¿Está seguro de asignar el id ${result.asignarIdTae.idTae} al negocio, ${negocio.nombre}?`
      );
      if (!isConfirmed) {
        return;
      }

      this.crudService
        .update({
            id: result.asignarIdTae.idTae,
            idNegocio: negocio.id,
            opc: 'asignarIdTae'
          },
          UrlServer.resetearCredencialesTae)
        .subscribe(() => {
          dialogRef.close();
        });
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

  private async promoteLicence(negocio: Negocio) {

    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Promover a licencia de tipo Soporte?'
    );
    if (!isConfirmed) {
      return;
    }
    this.crudService.updateById({id: negocio.id}, UrlServer.promoteLicence).subscribe((response) => {
      this.genericoService.openSnackBar(response.mensaje, 'Aceptar', 'snack-bar-success', () => {
      });
      // this.resetOffset();
    });
  }

  private async increaseLicence(negocio: Negocio) {
    // Esperar a que se cargue la lista de movimientos
    await this.listLogMovimientos(negocio);

    const fieldForms: FieldForm[] = [
      {
        form: 'asignarDiasLicenciaDemo',
        fields: [
          [
            {
              name: 'numeroDias',
              label: 'Número de días',
              type: 'text',
              validation: Validators.compose([Validators.required, this.validationMessagesService.soloNumeros()])
            }
          ],
        ]
      }
    ];

    const dialogSize = this.genericoService.getDialogSize();
    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: 'Asignar días licencia demo',
        twoColumn: true,
        fieldForms,
        componente: ListaGenericaComponent,
        datos: { // estos datos son para el componente ListaGenericaComponente
          columns: this.columns,
          data: this.logsList // Ya estará cargado
        },
      },
      disableClose: true,
      minWidth: dialogSize.width,
    });

    dialogRef.componentInstance.submitForm.subscribe(async result => {
      const isConfirmed = await this.genericoService.confirmDialog(
        `¿Está seguro de asignar días al negocio ${negocio.nombre}?`
      );
      if (!isConfirmed) {
        return;
      }

      result = result.asignarDiasLicenciaDemo;
      result.id = negocio.id;
      this.crudService.updateById(result, UrlServer.updateLicenciaDemo).subscribe((response) => {
        dialogRef.close();
        if (response) this.genericoService.openSnackBar(
          response?.mensaje,
          'Aceptar', 'snack-bar-success',
          () => {}
        );
      });
    });
  }

  public async listLogMovimientos(negocio: Negocio): Promise<void> {
    try {
      const resp: any = await firstValueFrom(
        this.crudService.list(
          {
            all: true,
            negocio: negocio.id,
          },
          UrlServer.logsMovimientosLicencia
        )
      );
      this.logsList = resp.data;
    } catch (error) {
      console.error('Error al cargar logs:', error);
      throw error; // Manejar errores en caso de que ocurra
    }
  }


}
