import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ColumnasTabla} from '../../catalogos/pais/pais.component';
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
import {Rol} from '../../../shared/models/rol';
import {RoleService} from '../../../core/services/role.service';
import {hasAllPermission, hasPermission} from '../../../core/helpers/utilities';
import {permisosRol} from '../../../core/helpers/permissions.data';

@Component({
  selector: 'app-role',
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
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  dataList: Partial<Rol>[] = [];
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
    {clave: 'id', valor: 'ID', tipo: "number"},
    {clave: 'authority', valor: 'Nombre', tipo: "texto"}
  ];
  actions = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      hideAction: (item: Rol) => {
        return hasPermission(permisosRol.update) && !this.rolesNoEditables.includes(item.authority.toUpperCase())
      }
    },
    {
      name: 'Gestionar permisos',
      icon: "admin_panel_settings",
      tooltipText: 'Gestionar permisos',
      callback: (item: any) => this.abrirGestorDePermisos(item),
      hideAction: (item: Rol) => {
        return item.authority !== 'ROLE_ADMIN' && hasAllPermission([permisosRol.actualizarPermiso, permisosRol.show]);
      }
    },
    {
      name: 'Gestionar permisos V2',
      icon: "admin_panel_settings",
      tooltipText: 'Gestionar permisos V2',
      callback: (item: any) => this.abrirNuevoGestorDePermisos(item),
      hideAction: (item: Rol) => {
        return item.pdv && hasAllPermission([permisosRol.actualizarPermiso, permisosRol.show]);
      }
    },
    {
      name: 'Clonar paquetes de permisos',
      icon: "folder_copy",
      tooltipText: 'Clonar paquetes de permisos',
      callback: (item: any) => this.abrirNuevoGestorDePermisos(item),
      hideAction: (item: Rol) => {
        return item.pdv && hasAllPermission([permisosRol.actualizarPermiso, permisosRol.show]);
      }
    },
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private roleService: RoleService,
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
    this.roleService
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
        form: 'role',
        fields: [
          [
            {
              name: 'filtroGeneral',
              label: 'Nombre',
              type: 'text',
            },
          ]
        ]
      }
    ]
  }

  procesarfiltros(form: any) {
    this.queryParams = ({...this.queryParams, ...form.role});
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
        form: 'role',
        fields: [
          [
            {
              name: 'authority',
              label: 'Nombre',
              value: 'authority',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'pdv',
              label: '¿Para punto de venta?',
              value: 'authority',
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
      result= result.role
      if (data.id) {
        result = ({...result, id: data.id})
        this.roleService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.roleService.create(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro creado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      }
      dialogRef.close();
    });

  }

  rolesNoEditables: Readonly<string[]> = [
    'ROLE_REPARTIDOR_ECOMMERCE',
    'ROLE_CLIENTE_ECOMMERCE',
    'ROLE_TENDERO',
    'ROLE_CAJERO_ADMIN',
    'ROLE_CAJERO',
  ];


  private async abrirGestorDePermisos(objeto: any) {
    alert('Sin funcionalidad');
  }

  private async abrirNuevoGestorDePermisos(objeto: any) {
    alert('Sin funcionalidad');
  }
}
