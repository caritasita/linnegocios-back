import {Component, OnInit, ViewChild} from '@angular/core';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {MatDialog} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {EstadoService} from '../../../core/services/estado.service';
import {ActionsTabla, ColumnasTabla} from '../pais/pais.component';
import {Estado} from '../../../shared/models/Estado';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {PaisService} from '../../../core/services/pais.service';
import {Pais} from '../../../shared/models/Pais';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {GenericoService} from '../../../core/services/generico.service';

@Component({
  selector: 'app-estado',
  standalone: true,
  imports: [
    TablaGenericaComponent,
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDrawer,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormDialogGenericoComponent,
  ],
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.scss'
})
export class EstadoComponent implements OnInit {
  paisList: Pais[] = [];
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
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'pais', valor: 'País', tipo: "texto"},
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
      name: 'Recuperar eliminado',
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
    private estadoService: EstadoService,
    private paisService: PaisService,
    private genericoService: GenericoService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.lista();
    this.getPaises();
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.estadoService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((response: any) => {

        this.dataList = response.data;
        this.totalRecords = response.count;
      });
  }

  getPaises(): void {
    this.paisService.list({all: true}).subscribe((paises: any) => {
      this.paisList = paises.data;
      this.transformedPaisList = this.paisList.map(pais => ({
        label: pais.nombre,
        value: pais.id
      }));
    });
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
       form: 'estado',
       fields: [
         [
           {
             name: 'filtroGeneral',
             label: 'Clave / Nombre',
             type: 'text',
           },
         ],
         [
           {
             name: 'pais',
             label: 'País',
             type: 'select',
             options: this.transformedPaisList,
           },
         ],
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
    form= form.estado
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
        form: 'estado',
        fields: [
          [
            {
              name: 'pais',
              label: 'País',
              value: 'pais',
              type: 'select',
              options: this.transformedPaisList,
              validation: Validators.required
            }
          ],
          [
            {
              name: 'clave',
              label: 'Clave',
              value: 'clave',
              type: 'text',
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
        ]
      }
    ]

    let titleDialog = 'Registrar estado'
    if (data.id) {
      titleDialog = 'Editar estado'
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
        this.estadoService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.estadoService.create(result).subscribe((respueta) => {
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

    this.estadoService.delete(objeto.id).subscribe(() => {
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
    this.estadoService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }

}
