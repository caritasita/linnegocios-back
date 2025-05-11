import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {Pais} from '../../../shared/models/Pais';
import {Estado} from '../../../shared/models/Estado';
import {Field, FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ColumnasTabla} from '../pais/pais.component';
import {EstadoService} from '../../../core/services/estado.service';
import {PaisService} from '../../../core/services/pais.service';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {ComprobanteFormaPagoService} from '../../../core/services/comprobante-forma-pago.service';
import {MetodoPagoService} from '../../../core/services/metodo-pago.service';
import {TipoComprobanteService} from '../../../core/services/tipo-comprobante.service';
import {TipoComprobante} from '../../../shared/models/tipo-comprobante';
import {MetodoDePago} from '../../../shared/models/MetodoDePago';

@Component({
  selector: 'app-comprobante-metodo-pago',
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
  templateUrl: './comprobante-metodo-pago.component.html',
  styleUrl: './comprobante-metodo-pago.component.scss'
})
export class ComprobanteMetodoPagoComponent implements OnInit{
  estadoList: Partial<Estado>[] = [];
  paisList: Partial<Pais>[] = [];
  tipoComprobanteList: TipoComprobante[] = []
  metodoDePagoList: MetodoDePago[] = []

  transformedPaisList!: any;
  transformedTipoComprobanteList!: any;
  transformedMetodoPagoList!: any;
  totalRecords = 0;
  fieldsFilters!: Field[];
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
    {clave: 'metodoDePago', valor: 'Metodo de pago', tipo: "texto"},
    {clave: 'tipoComprobante', valor: 'Tipo de comprobante', tipo: "texto"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
  ];
  actions = [
    {name: 'Editar', icon: "edit", tooltipText: 'Editar', callback: (item: any) => this.openFormDialog(item)},
    {name: 'Eliminar', icon: "delete", tooltipText: 'Eliminar', callback: (item: any) => this.delete(item)},
    {name: 'Recuperar eliminado', icon: "restore_from_trash", tooltipText: 'Recuperar registro eliminado', callback: (item: any) => this.recoverRegister(item.id)}
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private comprobanteFormaPagoService: ComprobanteFormaPagoService,
    private paisService: PaisService,
    private metodoPagoService: MetodoPagoService,
    private tipoComprobanteService: TipoComprobanteService,
    private genericoService: GenericoService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.lista();
    this.getPaises();
    this.listTipoComprobante();
    this.listMetodoDePagoService()
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.comprobanteFormaPagoService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((estados: any) => {
        this.estadoList = estados.data;
        this.totalRecords = estados.count;
      });
  }

  private listTipoComprobante(): void {
    this.tipoComprobanteService
      .list({ all: true })
      .subscribe((response: any) => {
        this.tipoComprobanteList = response?.data;
        this.transformedTipoComprobanteList = this.tipoComprobanteList.map(item => ({
          label: item.nombre,
          value: item.id
        }));
        console.table(this.tipoComprobanteList);
      });
  }

  private listMetodoDePagoService(): void {
    this.metodoPagoService
      .list({ all: true })
      .subscribe((response: any) => {
        this.metodoDePagoList = response.data;
        console.table(this.metodoDePagoList)
        this.transformedMetodoPagoList = this.metodoDePagoList.map(item => ({
          label: item.nombre,
          value: item.id
        }));
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
        name: 'tipoComprobante',
        label: 'Tipo de comprobante',
        type: 'select',
        options: this.transformedTipoComprobanteList,
      },
      {
        name: 'metodoDePago',
        label: 'Metodo de pago',
        type: 'select',
        options: this.transformedMetodoPagoList,
      },
      {
        name: 'registrosEliminados',
        label: 'Ver eliminados',
        type: 'toggle',
      },
    ]
  }

  procesarfiltros(form: any) {
    this.queryParams= ({...this.queryParams, ...form});
    this.lista();
  }

  resetFormFiltros(){
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
          validation: Validators.compose([Validators.required]),
          fillColumn: 'fill-two-column'
        },
        {
          name: 'simbolo',
          label: 'Símbolo',
          type: 'text',
          validation: Validators.required,
          fillColumn: 'fill-one-column'
        },
      ],
      [
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          validation: Validators.required,
          fillColumn: 'fill-one-column'
        },
      ],
      [
        {
          name: 'tipoComprobante',
          label: 'Tipo de comprobante',
          type: 'select',
          options: this.transformedTipoComprobanteList,
          validation: Validators.required,
          fillColumn: 'fill-two-column'
        },
        {
          name: 'valor',
          label: 'Valor',
          type: 'number',
          validation: Validators.required,
          fillColumn: 'fill-one-column'
        },
      ],
      [
        {
          name: 'pais',
          label: 'País',
          type: 'select',
          options: this.transformedPaisList,
          validation: Validators.required
        },
        {
          name: 'metodoDePago',
          label: 'Método de pago',
          type: 'select',
          options: this.transformedMetodoPagoList,
          validation: Validators.required
        },
      ],
      [
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'text',
        },
      ],
      [
        {
          name: 'imagen',
          label: 'Imagen',
          type: 'file',
          hideInput: true
        },
      ]
    ]

    let titleDialog = 'Registrar tipo de ticket'
    if (data.id) {
      titleDialog = 'Editar tipo de ticket'
    }

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fields,
        data
      },
      panelClass: 'dialog-linnegocios',
      disableClose: true,
      minWidth: '50vw',
      maxWidth: '75vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {
      if (data.id) {
        result = ({...result, id: data.id, valor:Number(result.valor), clave: data.clave})
        this.comprobanteFormaPagoService.update(result).subscribe((respueta) => {
          if(respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () =>{});
          this.lista();
        });
      } else {
        result = ({...result, valor:Number(result.valor)})
        this.comprobanteFormaPagoService.create(result).subscribe((respueta) => {
          if(respueta) this.genericoService.openSnackBar('Registro creado exitosamente', 'Aceptar', 'snack-bar-success', () =>{});
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

    this.comprobanteFormaPagoService.delete(objeto.id).subscribe(() => {
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
    this.comprobanteFormaPagoService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }
}
