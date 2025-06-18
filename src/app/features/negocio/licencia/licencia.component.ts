import {Component, OnInit, ViewChild} from '@angular/core';
import {
  Field,
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {LicenciaPagoService} from '../../../core/services/licencia-pago.service';
import {Negocio} from '../../../shared/models/negocio';
import {Estatus} from '../../../shared/models/estatus';
import {PagoDetalle} from '../../../shared/models/pago-detalle';

@Component({
  selector: 'app-licencia',
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
  templateUrl: './licencia.component.html',
  styleUrl: './licencia.component.css'
})
export class LicenciaComponent implements OnInit {
  pagoDetalleList!: ReportePagoDetalle[];
  totalPorMetodoPago!: any[];
  totalRecords: number = 0;
  fieldsFilters!: Field[];
  queryParams = {
    max: 10,
    offset: 0,
    backOffice: true,
  };
  columns: ColumnasTabla[] = [
    {clave: 'dateCreated', valor: 'Fecha de pago', tipo: "fecha"},
    {clave: 'usuarioPago', valor: 'Usuario pagó', tipo: "texto"},
    {clave: 'negocio', valor: 'Negocio', tipo: "texto"},
    {clave: 'estadoPago', valor: 'Estatus', tipo: "texto"},
    {clave: 'fechaValidez', valor: 'Vigencia', tipo: "fecha"},
    {clave: 'metodoPago', valor: 'Método de pago', tipo: "texto"},
    {clave: 'total', valor: 'Total', tipo: "moneda"},
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Detalle pago',
      icon: "visibility",
      tooltipText: 'Detalle pago',
      callback: (item: any) => this.detallePago(item),
    },
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private licenciaPagoService: LicenciaPagoService
  ) {
  }

  ngOnInit() {
    this.lista();
  }

  lista() {
    this.licenciaPagoService
      .list(this.queryParams)
      .subscribe(({data, count, totalPorMetodoPago}: any) => {
        this.pagoDetalleList = data;
        this.totalPorMetodoPago = totalPorMetodoPago;
        this.totalRecords = count;
      });
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        name: 'filtroGeneral',
        label: 'Clave / Nombre',
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
      backOffice: true,
    };
    this.lista()
  }

  public handlePageChange(event: any) {
    this.queryParams.max = event.max;
    this.queryParams.offset = event.offset;
    this.lista();
  }

  detallePago(item: any){}
}

// const OPTION_CONFIG = {
//   negocio: ID_NOMBRE_OPTION_CONFIG,
//   sucursal: ID_NOMBRE_OPTION_CONFIG,
//   caja: ID_NOMBRE_OPTION_CONFIG,
//   estatus: ID_NOMBRE_OPTION_CONFIG,
//   formaCobro: ID_NOMBRE_OPTION_CONFIG,
//   filtroFecha: ID_NOMBRE_OPTION_CONFIG,
// };
//
// const DATE_TYPES_FILTERS = [
//   {id: 'fechaRegistro', nombre: 'FECHA DE REGISTRO'},
//   {id: 'fechaPago', nombre: 'FECHA DE PAGO'},
//   {id: 'fechaCorte', nombre: 'FECHA DE CORTE'},
// ];

interface ReportePagoDetalle {
  id: any;
  concepto: string;
  dateCreated: Date;
  fechaLimitePago: Date;
  fechaValidez: Date;
  total: number;
  subTotal: number;
  iva: number;
  negocio: Negocio;
  metodoPago: string;
  estadoPago: Estatus;
  formaCobro: Partial<{ mese: number; nombre: string }>;
  usuarioPago: Partial<{ nombre: string }>;
  pagoDetalleList: PagoDetalle[];
}
