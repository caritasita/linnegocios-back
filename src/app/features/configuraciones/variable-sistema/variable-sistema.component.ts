import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {
  Field,
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {VariableSistema} from '../../../shared/models/VariableSistema';
import {VariableSistemaService} from '../../../core/services/variable-sistema.service';
import {hasPermission} from '../../../core/helpers/utilities';
import {permisosEmpresaCredencial, permisosVariableSistema} from '../../../core/helpers/permissions.data';

@Component({
  selector: 'app-variable-sistema',
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
  templateUrl: './variable-sistema.component.html',
  styleUrl: './variable-sistema.component.css'
})
export class VariableSistemaComponent implements OnInit {
  dataList: Partial<VariableSistema>[] = [];
  totalRecords = 0;
  fieldsFilters!: Field[];
  transformedPaisList!: any;
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'valor', valor: 'Valor', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      hideAction: (item: any) => {
        return hasPermission(permisosVariableSistema.update) || !item.activo
      }
    },
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      callback: (item: any) => this.delete(item),
      hideAction: (item: any) => {
        return hasPermission(permisosVariableSistema.delete) || !item.activo
      }
    },
    {
      name: 'recuperarEliminado',
      icon: "restore_from_trash",
      tooltipText: 'Recuperar registro eliminado',
      callback: (item: any) => this.recoverRegister(item.id),
      hideAction: (item: any) => {
        return hasPermission(permisosVariableSistema.delete) || item.activo
      }
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private variableSistemaService: VariableSistemaService,
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
    this.variableSistemaService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((response: any) => {

        this.dataList = response.data;
        this.totalRecords = response.count;
      });
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        name: 'filtroGeneral',
        label: 'Nombre / Valor',
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
        form: 'variableSistema',
        fields: [
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
              name: 'valor',
              label: 'Valor',
              value: 'valor',
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
              name: 'encriptado',
              label: 'Activa la opción si quieres que el valor se encripte en base de datos',
              type: 'toggle',
            }
          ],
        ]
      }
    ]

    let titleDialog = 'Registrar estado'
    if (data.id) {
      titleDialog = 'Editar estado'
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
        result= result.variableSistema
        result = ({...result, id: data.id})
        this.variableSistemaService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.variableSistemaService.create(result).subscribe((respueta) => {
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

    this.variableSistemaService.delete(objeto.id).subscribe(() => {
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
    this.variableSistemaService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }

}
