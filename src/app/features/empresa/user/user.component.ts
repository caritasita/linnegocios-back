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
import {User} from '../../../shared/models/User';
import {UserService} from '../../../core/services/user.service';
import {RoleService} from '../../../core/services/role.service';
import {Rol} from '../../../shared/models/rol';
import {ValidationMessagesService} from '../../../core/services/validation-messages.service';

@Component({
  selector: 'app-user',
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
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  dataList: Partial<User>[] = [];
  roleList: Rol[] = [];
  totalRecords = 0;
  fieldsFilters!: Field[];
  transformedRoleList!: any;
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    opcion: 'sinCajero',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'nombreCompleto', valor: 'Nombre', tipo: "texto"},
    {clave: 'email', valor: 'Correo', tipo: "texto"},
    {clave: 'telefono', valor: 'Teléfono', tipo: "texto"},
    {clave: 'username', valor: 'Username', tipo: "texto"},
    {clave: 'role', valor: 'Rol', tipo: "texto"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      hideAction: (item: any) => {
        return !item.activo
      }
    },
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      callback: (item: any) => this.delete(item),
      hideAction: (item: any) => {
        return !item.activo
      }
    },
    {
      name: 'resetDatosDeAcceso',
      icon: "lock_reset",
      tooltipText: 'Resetear contraseña',
      callback: (item: any) => this.resetPassword(item?.id),
      hideAction: (item: any) => {
        return !item.activo
      }
    },
    {
      name: 'recuperarEliminado',
      icon: "restore_from_trash",
      tooltipText: 'Recuperar registro eliminado',
      callback: (item: any) => this.recoverRegister(item.id),
      hideAction: (item: any) => {
        return item.activo
      }
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private genericoService: GenericoService,
    private dialog: MatDialog,
    private validationMessagesService: ValidationMessagesService
  ) {
  }

  ngOnInit() {
    this.lista();
    this.getRoles();
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.userService
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
      nombreCompleto: item?.nombre ? `${item?.nombre} ${item?.apeidoPaterno} ${item?.apeidoMaterno}` : '---', //Dato que se muestra en la tabla
      nombre: item.nombre,
      apeidoPaterno: item.apeidoPaterno,
      apeidoMaterno: item.apeidoMaterno,
      email: item?.email,
      telefono: item?.telefono,
      username: item?.username,
      role: item?.role,
      activo: item?.enabled,
      accountLocked: item.accountLocked
    }));
  }

  getRoles() {
    this.roleService
      .list({
        ocultarCajeroSimple: true,
        ocultarCajeroAdmin: true,
        ocultarClienteEcommerce: true,
        ocultarRepartidor: true,
        ocultarTendero: true,
        all: true,
      })
      .subscribe((response: any) => {
        this.roleList = response.data;
        this.transformedRoleList = this.roleList.map((item: any) => ({
          label: item.authority,
          value: item.authority
        }));
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
      opcion: 'sinCajero',
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
        form: 'user',
        fields: [
          [
            {
              name: 'role',
              label: 'Rol',
              value: 'role',
              type: 'select',
              options: this.transformedRoleList,
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
              validation: Validators.required
            }
          ],
          [
            {
              name: 'email',
              label: 'Correo electrónico',
              value: 'email',
              type: 'email',
              validation: Validators.compose([Validators.required, Validators.email])
            },
            {
              name: 'telefono',
              label: 'Teléfono',
              value: 'telefono',
              type: 'tel',
              maxLenght: 10,
              validation: Validators.compose([Validators.required, this.validationMessagesService.telefonoValido()])
            },
          ],
          [
            {
              name: 'username',
              label: 'Usuario',
              value: 'username',
              type: 'text',
              validation: Validators.required
            },
          ],
          [
            {
              name: 'accountLocked',
              label: 'Bloquear',
              value: 'accountLocked',
              type: 'toggle',
            },
            {
              name: 'enabled',
              label: 'Estatus',
              type: 'toggle',
              visibility: true
            }
          ]
        ]
      }
    ]


    let titleDialog = 'Registrar usuario'
    if (data.id) {

      titleDialog = 'Editar usuario'

      fieldForms = fieldForms.filter(form => ({
        ...form,
        fields: form.fields?.map(group =>
          group.map(field => {
            if(field.name === 'role'){
              field.visibility= true;
            }
          })
        )
      }));
    }
    // console.log('fields');
    // console.table(fields);

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fieldForms,
        data
      },
      disableClose: true,
      minWidth: '50vw',
      maxWidth: '65vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {
      result= result.user
      if (data.id) {
        console.log('entrando a EDITAR');

        result = ({...result, id: data.id, enabled: true})
        this.userService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        console.log('entrando a CREAR');
        this.userService.create(result).subscribe((respueta) => {
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

    this.userService.delete(objeto.id).subscribe(() => {
      this.lista();
    });
  }

  private async resetPassword(id: number) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Está seguro de resetear la contraseña del usuario?'
    );
    if (!isConfirmed) {
      return;
    }

    this.userService.resetPassword(id).subscribe(() => {
      this.lista()
      this.genericoService.openSnackBar('Contraseña reseteada correctamente.', 'Aceptar', 'snack-bar-success', () => {
      });
    });
  }

  private async recoverRegister(id: number) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Está seguro de recuperar el registro?'
    );
    if (!isConfirmed) {
      return;
    }
    this.userService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }

}
