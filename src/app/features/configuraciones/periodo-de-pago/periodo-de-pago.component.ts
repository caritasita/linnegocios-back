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
import {ConfiguracionCobroMes} from '../../../shared/models/ConfiguracionCobroMes';
import {PeriodoDePagoService} from '../../../core/services/periodo-de-pago.service';

@Component({
  selector: 'app-periodo-de-pago',
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
  templateUrl: './periodo-de-pago.component.html',
  styleUrl: './periodo-de-pago.component.css'
})
export class PeriodoDePagoComponent implements OnInit {
  dataList: Partial<ConfiguracionCobroMes>[] = [];
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
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'meses', valor: 'Meses', tipo: "number"},
    {clave: 'descuento', valor: 'Descuento', tipo: "porcentaje"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
  ];
  actions = [
    {name: 'Editar', icon: "edit", tooltipText: 'Editar', callback: (item: any) => this.openFormDialog(item)},
    {name: 'Eliminar', icon: "delete", tooltipText: 'Eliminar', callback: (item: any) => this.delete(item)},
    {
      name: 'Recuperar eliminado',
      icon: "restore_from_trash",
      tooltipText: 'Recuperar registro eliminado',
      callback: (item: any) => this.recoverRegister(item.id)
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private periodoDePagoService: PeriodoDePagoService,
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
    this.periodoDePagoService
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
        label: 'Nombre / Mes / Descuento',
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
          name: 'meses',
          label: 'Meses',
          type: 'number',
          validation: Validators.required
        }
      ],
      [
        {
          name: 'descuento',
          label: 'Descuento',
          type: 'number',
          validation: Validators.required
        }
      ],
    ]

    let titleDialog = 'Registrar periodo de pago'
    if (data.id) {
      titleDialog = 'Editar periodo de pago'
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
        this.periodoDePagoService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.periodoDePagoService.create(result).subscribe((respueta) => {
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

    this.periodoDePagoService.delete(objeto.id).subscribe(() => {
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
    this.periodoDePagoService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }

}
