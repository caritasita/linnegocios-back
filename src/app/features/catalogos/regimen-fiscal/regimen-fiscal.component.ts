import {Component, OnInit, ViewChild} from '@angular/core';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {EstadoService} from '../../../core/services/estado.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {
  Field,
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {RegimenFiscalService} from '../../../core/services/regimenFiscal.service';
import {ColumnasTabla} from '../pais/pais.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';

@Component({
  selector: 'app-regimen-fiscal',
  standalone: true,
  imports: [
    TablaGenericaComponent,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatIcon,
    MatToolbar,
    NgIf,
    MatDrawerContainer,
    FormGenericoComponent,
    MatDrawer,
    MatIconButton,
    FormDialogGenericoComponent
  ],
  templateUrl: './regimen-fiscal.component.html',
  styleUrl: './regimen-fiscal.component.css'
})
export class RegimenFiscalComponent implements OnInit {
  totalRecords: number = 0;
  regimenFiscalList: any[] = [];
  fieldsFilters!: FieldForm[];
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
    {clave: 'activo', valor: 'Activo', tipo: "boleano"}
  ];
  actions = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      hideAction: (item: any) => {
        if (item.activo) {
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
        if (item.activo) {
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
        if (!item.activo) {
          return item.activo
        }
        return true
      }
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private regimenFiscalService: RegimenFiscalService,
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
    this.regimenFiscalService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((regimenFiscalList: any) => {
        this.regimenFiscalList = regimenFiscalList.data;
        this.totalRecords = regimenFiscalList.count;
      });
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: 'regimenFiscal',
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
    this.queryParams = ({...this.queryParams, ...form.regimenFiscal});
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
        form: 'regimenFiscal',
        fields: [
          [
            {
              name: 'clave',
              label: 'Clave',
              value: 'clave',
              type: 'text',
              disabled: false,
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

    let titleDialog = 'Registrar régimen fiscal'
    if (data.id) {
      titleDialog = 'Editar régimen fiscal'
      this.genericoService.setFieldDisabled(fieldForms, 'clave', true)
    }
    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fieldForms,
        data
      },
      disableClose: true,
      width: '400px',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {
      if (data.id) {
        result = ({...result, id: data.id})
        this.regimenFiscalService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.regimenFiscalService.create(result).subscribe((respueta) => {
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
    this.regimenFiscalService.delete(objeto.id).subscribe(() => {
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
    this.regimenFiscalService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }
}
