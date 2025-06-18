import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FieldForm,
  FormDialogGenericoComponent
} from "../../../shared/form-dialog-generico/form-dialog-generico.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {TablaGenericaComponent} from "../../../shared/tabla-generica/tabla-generica.component";
import {Estado} from '../../../shared/models/Estado';
import {ActionsTabla, ColumnasTabla} from '../../catalogos/pais/pais.component';
import {CrudService} from '../../../core/services/crud.service';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {UrlServer} from '../../../core/helpers/UrlServer';

@Component({
  selector: 'app-credenciales-facturacion',
  standalone: true,
  imports: [
    FormDialogGenericoComponent,
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
  templateUrl: './credenciales-facturacion.component.html',
  styleUrl: './credenciales-facturacion.component.css'
})
export class CredencialesFacturacionComponent implements OnInit {
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
    // {clave: 'negocio', valor: 'ID negocio', tipo: "texto"},
    {clave: 'negocio', valor: 'Negocio', tipo: "texto"},
    {clave: 'usuario', valor: 'usuario', tipo: "texto"},
    {clave: 'password', valor: 'Contraseña', tipo: "password"},
    {clave: 'url', valor: 'url', tipo: "texto"}
  ];
  actions: ActionsTabla[] = [
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      callback: (item: any) => this.delete(item),
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private crudService: CrudService,
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

    this.crudService.list({
      ...this.queryParams,
      tipoCredencial: 'FACTURA',
      registrosActivos: !this.queryParams.registrosEliminados,
    }, UrlServer.credencialElectronico)
      .subscribe((credenciales: any) => {
        this.dataList = this.generarTablaPersonalizada(credenciales.data);
        this.totalRecords = credenciales.count;
      });
  }

  generarTablaPersonalizada(data: any): any {
    return data.map((item: any, index: number) => ({
      ...data[index],
      negocio: `<b class="fz-title-fila-tabla">( ID: ${item?.negocio.id} )</b> ${item?.negocio.nombre}`,
      usuario: item.usuario,
      password: item.password,
      url: item.url,
    }));
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: 'credenciales',
        fields: [
          // [
          //   {
          //     name: 'filtroGeneral',
          //     label: 'Clave / Nombre',
          //     type: 'text',
          //   },
          // ],
        ]
      }

    ]
  }

  procesarfiltros(form: any) {
    form = form.estado
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

  private async delete(objeto: any) {
    const isConfirmed = await this.genericoService.confirmDialog(
      '¿Está seguro de eliminar el registro?'
    );
    if (!isConfirmed) {
      return;
    }

    this.crudService.delete(UrlServer.credencialElectronico, objeto.id).subscribe(() => {
      this.lista();
    });
  }

}
