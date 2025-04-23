import {Component, OnInit, ViewChild} from '@angular/core';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {EstadoService} from '../../../core/services/estado.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {RegimenFiscalService} from '../../../core/services/regimenFiscal.service';
import {ColumnasTabla} from '../pais/pais.component';

@Component({
  selector: 'app-regimen-fiscal',
  standalone: true,
  imports: [
    TablaGenericaComponent
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
    private regimenFiscalService: RegimenFiscalService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.list();
  }

  list(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.regimenFiscalService
      .get({
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
    this.list();
  }

  openFormDialog(data: any = {}) {

    const fields = [
      {name: 'clave', type: 'text', validation: Validators.required},
      {name: 'nombre', type: 'text', validation: Validators.required}
    ]

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: "Registrar país",
        fields,
        data
      },
      disableClose: true,
      width: '400px',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {
      if (data.id) {
        // this.paisService.updatePais(data.id, result).subscribe(() => this.loadCountries());
      } else {
        // this.paisService.createPais(result).subscribe(() => this.loadCountries());
      }
      dialogRef.close();
    });
  }

  deletePais(pais: any) {
    this.regimenFiscalList = this.regimenFiscalList.filter(p => p.clave !== pais.clave)
  }

  verDetalle(item: any) {
    alert(`ver Detalle ${item.nombre}`)
  }
}
