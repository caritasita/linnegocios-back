import {Component, OnInit, ViewChild} from '@angular/core';
import {Pais} from '../../../shared/models/Pais';
import {Estado} from '../../../shared/models/Estado';
import {Field, FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ColumnasTabla} from '../../catalogos/pais/pais.component';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {EstadoService} from '../../../core/services/estado.service';
import {PaisService} from '../../../core/services/pais.service';
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
import {Rol} from '../../../shared/models/rol';
import {RoleService} from '../../../core/services/role.service';

@Component({
  selector: 'app-role',
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
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  dataList: Partial<Rol>[] = [];
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
    {clave: 'id', valor: 'ID', tipo: "number"},
    {clave: 'authority', valor: 'Nombre', tipo: "texto"}
  ];
  actions = [
    {name: 'Editar', icon: "edit", tooltipText: 'Editar', callback: (item: any) => this.openFormDialog(item)},
    {name: 'Gestionar permisos', icon: "admin_panel_settings", tooltipText: 'Gestionar permisos', callback: (item: any) => this.abrirGestorDePermisos(item)},
    {name: 'Gestionar permisos V2', icon: "admin_panel_settings", tooltipText: 'Gestionar permisos V2', callback: (item: any) => this.abrirNuevoGestorDePermisos(item)},
    {name: 'Clonar paquetes de permisos', icon: "folder_copy", tooltipText: 'Clonar paquetes de permisos', callback: (item: any) => this.abrirNuevoGestorDePermisos(item)},
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
        name: 'filtroGeneral',
        label: 'Nombre',
        type: 'text',
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
          name: 'authority',
          label: 'Nombre',
          type: 'text',
          validation: Validators.required
        }
      ],
      [
        {
          name: 'pdv',
          label: '¿Para punto de venta?',
          type: 'toggle',
        }
      ],
    ]

    let titleDialog = 'Registrar estado'
    if (data.id) {
      titleDialog = 'Editar estado'
    }

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fields,
        data
      },
      disableClose: true,
      width: '50vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {
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

  private async abrirGestorDePermisos(objeto: any) {
    alert('Sin funcionalidad');
  }

  private async abrirNuevoGestorDePermisos(objeto: any) {
    alert('Sin funcionalidad');
  }
}
