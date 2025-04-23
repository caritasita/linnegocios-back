import {Component, OnInit, ViewChild} from '@angular/core';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {PaisService} from '../../../core/services/pais.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {Validators} from '@angular/forms';
import {FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';

export interface ColumnasTabla {
  clave: string,
  valor: string,
  tipo: string,
}

@Component({
  selector: 'app-pais',
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
  ],
  templateUrl: './pais.component.html',
  styleUrl: './pais.component.css',
})
export class PaisComponent implements OnInit {
  paisList: any[] = [];

  columns : ColumnasTabla[] = [
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"}
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
  totalRecords: number = 0;

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private paisService: PaisService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.loadPaises();
  }

  loadPaises(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.paisService
      .get({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((paises: any) => {
        this.paisList = paises.data;
        this.totalRecords = paises.count;
        this.paisList = this.datosTabla;
      });
  }


  // Transformar los datos para la tabla
  get datosTabla(): any {
    return this.paisList.map(pais => ({
      id: pais?.id,
      fechaRegistro: pais?.fechaRegistro,
      clave: pais?.clave,
      nombre: pais?.nombre,
      descripcion: pais?.descripcion,
    }));
  }

  public handlePageChange(event: any) {
    this.queryParams.max = event.max;
    this.queryParams.offset = event.offset;
    this.loadPaises();
  }

  openFormDialog(data: any = {}) {

    const fields = [
      {name: 'clave', type: 'text', validation: Validators.required},
      {name: 'nombre', type: 'text', validation: Validators.required}
    ]

    let titleDialog= 'Registrar país'
    if(data.id) {
      titleDialog= 'Editar pais'
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
        result = ({...result, id: data.id})
        this.paisService.update(result).subscribe(() => this.loadPaises());
      } else {
        this.paisService.create(data).subscribe(() => this.loadPaises());
      }
      dialogRef.close();
    });
  }

  deletePais(pais: any) {
    this.paisList = this.paisList.filter(p => p.clave !== pais.clave)
  }

  verDetalle(item: any) {
    alert(`ver Detalle ${item.nombre}`)
  }
}
