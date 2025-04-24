import {Component, OnInit, ViewChild} from '@angular/core';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {Field, FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {EstadoService} from '../../../core/services/estado.service';
import {ColumnasTabla} from '../pais/pais.component';
import {Estado} from '../../../shared/models/Estado';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {PaisService} from '../../../core/services/pais.service';
import {Pais} from '../../../shared/models/Pais';

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
export class EstadoComponent implements OnInit {
  paisList: Pais[] = [];
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
    {name: 'Eliminar', icon: "delete", callback: (item: any) => this.delete(item)},
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
    private paisService: PaisService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.lista();
    this.getPaises();
  }

  lista(resetOffset = false) {

    if (resetOffset) {
      this.queryParams.offset = 0;
    }

    this.estadoService
      .get({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((estados: any) => {

        this.estadoList = estados.data;
        this.totalRecords = estados.count;
      });
  }

  getPaises(): void {
    this.paisService.list({all: true}).subscribe((paises: any) => {
      this.paisList = paises.data;
    });
  }

  openFormDialog(data: any = {}) {

    const transformedPaisList = this.paisList.map(pais => ({
      label: pais.nombre,
      value: pais.id
    }));

    const fields : Field[] = [
      {
        name: 'pais',
        label: 'País',
        type: 'select',
        options: transformedPaisList,
        validation: Validators.required
      },
      {
        name: 'clave',
        label: 'Clave',
        type: 'text',
        validation: Validators.required
      },
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        validation: Validators.required
      },
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
        this.estadoService.update(result).subscribe(() => this.lista());
      } else {
        this.estadoService.create(result).subscribe(() => this.lista());
      }
      dialogRef.close();
    });
  }

  delete(objeto: any) {
    this.estadoService.delete(objeto.id).subscribe(() => {
      this.lista();
    });
  }

  verDetalle(item: any) {
    alert(`ver Detalle ${item.nombre}`)
  }

  public handlePageChange(event: any) {
    this.queryParams.max = event.max;
    this.queryParams.offset = event.offset;
    this.lista();
  }
}
