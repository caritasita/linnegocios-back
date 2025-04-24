import {Component, OnInit, ViewChild} from '@angular/core';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {EstadoService} from '../../../core/services/estado.service';
import {ColumnasTabla} from '../pais/pais.component';
import {Estado} from '../../../shared/models/Estado';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-estado',
  standalone: true,
  imports: [
    TablaGenericaComponent,
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.css'
})
export class EstadoComponent implements OnInit{
  estadoList: Partial<Estado>[] = [];

  columns: ColumnasTabla[] = [
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'pais', valor: 'País', tipo: "texto"},
  ];

  actions = [
    {name: 'Editar', icon: "edit", callback: (item: any) => this.openFormDialog(item)},
    {name: 'Eliminar', icon: "delete", callback: (item: any) => this.deletePais(item)},
    {name: 'Ver detalle', icon: "visibility", callback: (item: any) => this.verDetalle(item)}
  ];

  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  totalRecords = 0;

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private estadoService: EstadoService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.loadEstados();
  }

  loadEstados(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }

    console.log('----- this.queryParams');
    console.table(this.queryParams);

    this.estadoService
      .get({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((estados: any) => {

        this.estadoList = estados.data;
        this.totalRecords = estados.count;
        console.log('COUNT');
        console.table(this.totalRecords);
        this.estadoList = this.datosTabla;
      });
  }

  // Transformar los datos para la tabla
  get datosTabla(): any {
    return this.estadoList.map(estado => ({
      id: estado?.id,
      fechaRegistro: estado?.fechaRegistro,
      clave: estado?.clave,
      nombre: estado?.nombre,
      descripcion: estado?.descripcion,
      pais: `<div>${estado?.pais?.nombre}</div>`,
    }));
  }

  openFormDialog(data: any = {}) {

    const fields = [
      {name: 'clave', type: 'text', validation: Validators.required},
      {name: 'nombre', type: 'text', validation: Validators.required},
      {name: 'pais', type: 'select', validation: Validators.required}
    ]

    let titleDialog= 'Registrar estado'
    if(data.id) {
      titleDialog= 'Editar estado'
    }

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fields,
        data
      },
      disableClose: true,
      width: '400px',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {
      if (data.id) {
        console.log('Entrando a editar estado');
        console.table(result);

        result = ({...result, id: data.id})
        this.estadoService.update(result).subscribe(() => this.loadEstados());
      } else {
        this.estadoService.create(result).subscribe(() => this.loadEstados());
      }
      dialogRef.close();
    });
  }

  deletePais(pais: any) {
    this.estadoList = this.estadoList.filter(p => p.clave !== pais.clave)
  }

  verDetalle(item: any) {
    alert(`ver Detalle ${item.nombre}`)
  }

  public handlePageChange(event: any) {
    this.queryParams.max = event.max;
    this.queryParams.offset = event.offset;
    this.loadEstados();
  }
}
