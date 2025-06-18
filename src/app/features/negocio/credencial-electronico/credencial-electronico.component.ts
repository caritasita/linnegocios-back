import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {Estado} from '../../../shared/models/Estado';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {CrudService} from '../../../core/services/crud.service';
import {UrlServer} from '../../../core/helpers/UrlServer';

@Component({
  selector: 'app-credencial-electronico',
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
    TablaGenericaComponent
  ],
  templateUrl: './credencial-electronico.component.html',
  styleUrl: './credencial-electronico.component.css'
})
export class CredencialElectronicoComponent implements OnInit {
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
    // {clave: 'negocio', valor: 'ID negocio', tipo: "texto"},
    {clave: 'negocio', valor: 'Tendero', tipo: "texto"},
    {clave: 'idEquivalencia', valor: 'ID Tae', tipo: "texto"},
    {clave: 'usuario', valor: 'usuario', tipo: "texto"},
    {clave: 'password', valor: 'Contraseña', tipo: "password"}
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
    },
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      callback: (item: any) => this.delete(item),
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private crudService: CrudService,
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

    this.crudService.list({
      ...this.queryParams,
      tipoCredencial: 'TAE',
      registrosActivos: !this.queryParams.registrosEliminados,
    }, UrlServer.credencialElectronico)
      .subscribe((credenciales: any) => {
        this.dataList = this.generarTablaPersonalizada(credenciales.data);
        this.totalRecords = credenciales.count;
      });
  }

  generarTablaPersonalizada(data: any): any {
    return data.map((item: any, index: number) => ({
      ...data[index],
      negocio: `<b class="fz-title-fila-tabla">( ID: ${item?.negocio.id} )</b> ${item?.negocio.nombre}`,
      idEquivalencia: item.idEquivalencia,
      usuario: item.usuario,
      password: item.password,
    }));
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: 'credenciales',
        fields: [
          // [
          //   {
          //     name: 'filtroGeneral',
          //     label: 'Clave / Nombre',
          //     type: 'text',
          //   },
          // ],
        ]
      }

    ]
  }

  procesarfiltros(form: any) {
    form = form.estado
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
    let isEditing = false
    let titleDialog = 'Registrar credenciales'
    if (data.id) {
      titleDialog = 'Editar credenciales'
      isEditing = true
    }

    const fieldForms: FieldForm[] = [
      {
        form: 'credenciales',
        fields: [
          ...(!isEditing ? [
            [
              {
                name: 'negocioAutocomplate',
                label: 'Negocio',
                value: 'negocioAutocomplate',
                type: 'autocomplete',
                urlServer: 'negocio',
                relatedField: 'negocio',
                validation: Validators.required
              }
            ]
          ] : []),
          // Solo incluye el campo "negocio" si no estás editando
          ...(!isEditing ? [
            [
              {
                name: 'negocio',
                label: 'Negocio',
                value: 'negocio',
                type: 'number',
                visibility: true,
              }
            ]
          ] : []),
          [
            {
              name: 'usuario',
              label: 'Usuario',
              value: 'usuario',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'password',
              label: 'Contraseña',
              value: 'password',
              type: 'text',
            }
          ],
        ]
      }
    ]

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
      result = result.credenciales
      result.tipoCredencial = 'TAE';
      result.empresa = 1;

      if (data.id) {
        result = ({...result, id: data.id})
        this.crudService.update(result, UrlServer.credencialElectronico).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.crudService.create(result, UrlServer.credencialElectronico).subscribe((respueta) => {
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

    this.crudService.delete(UrlServer.credencialElectronico, objeto.id).subscribe(() => {
      this.lista();
    });
  }

  async syncProductosElectronicos() {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Sincronizar productos electrónicos?'
    );
    if (!isConfirmed) {
      return;
    }

    this.crudService
      .get(0, UrlServer.syncProductosElectronicos)
      .subscribe(() => {
      });
  }

  async syncCredenciales() {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Actualizar todas las credenciales?'
    );
    if (!isConfirmed) {
      return;
    }

    this.crudService
      .get(null, UrlServer.resetearCredencialesTae)
      .subscribe(() => {
      });
  }

}
