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
  FormDialogGenericoComponent,
  OptionField
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ColumnasTabla} from '../pais/pais.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {ImpuestoProducto} from '../../../shared/models/ImpuestoProducto.model';
import {ImpuestosProductoService} from '../../../core/services/impuestos-producto.service';

@Component({
  selector: 'app-impuestos-producto',
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
  templateUrl: './impuestos-producto.component.html',
  styleUrl: './impuestos-producto.component.css'
})
export class ImpuestosProductoComponent implements OnInit {
  dataList: Partial<ImpuestoProducto>[] = [];
  tiposImpuestoList: OptionField[] = [];

  totalRecords = 0;
  fieldsFilters!: Field[];
  transformedTipoImpuestoList!: any;
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'tipoImpuesto', valor: 'Tipo', tipo: "texto"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'porcentaje', valor: 'Porcentaje', tipo: "porcentaje"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'usuarioRegistro', valor: 'Usuario registró', tipo: "texto"},
  ];
  actions = [
    {name: 'Eliminar', icon: "delete", tooltipText: 'Eliminar', callback: (item: any) => this.delete(item)},
  ];


  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private impuestosProductoService: ImpuestosProductoService,
    private genericoService: GenericoService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.lista();
    this.getListImpustos()
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.impuestosProductoService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((response: any) => {

        this.dataList = this.generarTablaPersonalizada(response.data);
        this.totalRecords = response.count;
      });
  }

  getListImpustos() {
    this.impuestosProductoService.listTiposImpuesto().subscribe((tipos) => {
      this.transformedTipoImpuestoList = tipos.map((item: any) => ({
        label: item?.nombre,
        value: item?.clave
      }));
    });
  }

  // Transformar los datos para la tabla
  generarTablaPersonalizada(data: any): any {
    return data.map((item: any) => ({
      id: item?.id,
      fechaRegistro: item?.fechaRegistro,
      tipoImpuesto: item?.impuesto,
      clave: item?.clave,
      nombre: item?.nombre,
      porcentaje: item?.porcentaje,
      descripcion: item?.descripcion,
      usuarioRegistro: item?.usuarioRegistro?.nombre ? `${item?.usuarioRegistro.nombre} ${item?.usuarioRegistro.apeidoPaterno} ${item?.usuarioRegistro.apeidoMaterno}` : '---',
    }));
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        name: 'filtroGeneral',
        label: 'Clave / Nombre',
        type: 'text',
      }
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
          name: 'clave',
          label: 'Clave',
          type: 'text',
          validation: Validators.required
        }
      ],
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
          name: 'porcentaje',
          label: 'Porcentaje',
          type: 'number',
          validation: Validators.required
        }
      ],
      [
        {
          name: 'tipoImpuesto',
          label: 'Impuesto',
          type: 'select',
          options: this.transformedTipoImpuestoList,
          validation: Validators.required
        }
      ],
      [
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'text',
        }
      ],
    ]

    let titleDialog = 'Registrar impuesto producto'

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
      this.impuestosProductoService.create(result).subscribe((respueta) => {
        if (respueta) this.genericoService.openSnackBar('Registro creado exitosamente', 'Aceptar', 'snack-bar-success', () => {
        });
        this.lista();
      });
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

    this.impuestosProductoService.delete(objeto.id).subscribe(() => {
      this.lista();
    });
  }

}
