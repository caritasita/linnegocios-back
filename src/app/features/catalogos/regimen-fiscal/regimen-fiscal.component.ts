import {Component, OnInit, ViewChild} from '@angular/core';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {EstadoService} from '../../../core/services/estado.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {Field, FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {RegimenFiscalService} from '../../../core/services/regimenFiscal.service';
import {ColumnasTabla} from '../pais/pais.component';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';

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
    NgIf
  ],
  templateUrl: './regimen-fiscal.component.html',
  styleUrl: './regimen-fiscal.component.css'
})
export class RegimenFiscalComponent implements OnInit{
  regimenFiscalList: any[] = [];
  columns : ColumnasTabla[] = [
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'activo', valor: 'Activo', tipo: "boleano"}
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

  totalRecords: number = 0;

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private regimenFiscalService: RegimenFiscalService,
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

  public handlePageChange(event: any) {
    this.queryParams.max = event.max;
    this.queryParams.offset = event.offset;
    this.lista();
  }

  openFormDialog(data: any = {}) {

    const fields: Field[] = [
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
      {
        name: 'descripcion',
        label: 'Descripción',
        type: 'text',
        validation: Validators.required
      }
    ]

    let titleDialog = 'Registrar régimen fiscal'
    if (data.id) {
      titleDialog = 'Editar régimen fiscal'
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
        this.regimenFiscalService.update(result).subscribe(() => this.lista());
      } else {
        this.regimenFiscalService.create(result).subscribe(() => this.lista());
      }
      dialogRef.close();
    });
  }

  delete(objeto: any) {
    this.regimenFiscalService.delete(objeto.id).subscribe(() => {
      this.lista();
    });  }

  verDetalle(item: any) {
    alert(`ver Detalle ${item.nombre}`)
  }
}
