import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawerContainer} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {Field} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {ColumnasTabla} from '../pais/pais.component';
import {UnidadMedidaService} from '../../../core/services/unidad-medida.service';

@Component({
  selector: 'app-unidad-medida',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatDrawerContainer,
    MatToolbar,
    TablaGenericaComponent
  ],
  templateUrl: './unidad-medida.component.html',
  styleUrl: './unidad-medida.component.css'
})
export class UnidadMedidaComponent implements OnInit {
  dataList: any[] = [];
  totalRecords: number = 0;
  fieldsFilters!: Field[];
  private queryParams = {
    all: true,
    onlyProducts: true,
  };
  columns: ColumnasTabla[] = [
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'tipo', valor: 'Tipo', tipo: "texto"}
  ];
  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private unidadMedidaService: UnidadMedidaService
  ) {
  }

  ngOnInit() {
    this.lista();
  }

  lista() {

    this.unidadMedidaService
      .list({
        ...this.queryParams,
      })
      .subscribe((response: any) => {
        this.dataList = response.data;
      });
  }
}
