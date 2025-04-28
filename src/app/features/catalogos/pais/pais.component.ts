import {Component, OnInit, ViewChild} from '@angular/core';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {PaisService} from '../../../core/services/pais.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {Field, FormDialogGenericoComponent} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {FormGenericoComponent} from '../../../shared/form-generico/form-generico.component';
import {GenericoService} from '../../../core/services/generico.service';

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
    MatDrawerContainer,
    FormGenericoComponent,
    MatDrawer,
    MatIconButton,
  ],
  templateUrl: './pais.component.html',
  styleUrl: './pais.component.css',
})
export class PaisComponent implements OnInit {
  paisList: any[] = [];
  totalRecords: number = 0;
  fieldsFilters!: Field[];
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns : ColumnasTabla[] = [
    {clave: 'fechaRegistro', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'activo', valor: 'Estatus', tipo: "boleano"},
  ];
  actions = [
    {name: 'Editar', icon: "edit", tooltipText: 'Editar', callback: (item: any) => this.openFormDialog(item)},
    {name: 'Eliminar', icon: "delete", tooltipText: 'Eliminar', callback: (item: any) => this.delete(item)},
    {name: 'Recuperar eliminado', icon: "restore_from_trash", tooltipText: 'Recuperar registro eliminado', callback: (item: any) => this.recoverRegister(item.id)}
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private paisService: PaisService,
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
    this.paisService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((paises: any) => {
        this.paisList = paises.data;
        this.totalRecords = paises.count;
      });
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        name: 'filtroGeneral',
        label: 'Clave / Nombre',
        type: 'text',
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

  // Transformar los datos para la tabla
  // get datosTabla(): any {
  //   return this.paisList.map(pais => ({
  //     id: pais?.id,
  //     fechaRegistro: pais?.fechaRegistro,
  //     clave: pais?.clave,
  //     nombre: pais?.nombre,
  //     descripcion: pais?.descripcion,
  //   }));
  // }

  public handlePageChange(event: any) {
    this.queryParams.max = event.max;
    this.queryParams.offset = event.offset;
    this.lista();
  }

  openFormDialog(data: any = {}) {

    const fields : Field[] = [
      {name: 'clave' ,label: 'Clave', type: 'text', validation: Validators.required},
      {name: 'nombre', label: 'Nombre', type: 'text', validation: Validators.required}
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
        this.paisService.update(result).subscribe((respueta) => {
          if(respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () =>{});
          this.lista();
        });
      } else {
        this.paisService.create(result).subscribe((respueta) => {
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

    this.paisService.delete(objeto.id).subscribe(() => {
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
    this.paisService.recover(id).subscribe(() => {
      this.lista(true);
    });
  }
}
