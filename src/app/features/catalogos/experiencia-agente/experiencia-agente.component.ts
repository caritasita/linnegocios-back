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
import {ExperienciaAgente} from '../../../shared/models/ExperienciaAgente.model';
import {ExperienciaAgenteService} from '../../../core/services/experiencia-agente.service';

@Component({
  selector: 'app-experiencia-agente',
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
  templateUrl: './experiencia-agente.component.html',
  styleUrl: './experiencia-agente.component.css'
})
export class ExperienciaAgenteComponent implements OnInit {
  dataList: Partial<ExperienciaAgente>[] = [];
  totalRecords = 0;
  fieldsFilters!: Field[];
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'dateCreated', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'lastUpdated', valor: 'Fecha de actualización', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'nombre', valor: 'Nombre', tipo: "texto"},
    {clave: 'descripcion', valor: 'Descripción', tipo: "texto"},
    {clave: 'cantidadProspectos', valor: 'Cantidad de prospectos', tipo: "texto"},
    {clave: 'createdBy', valor: 'Registrado por', tipo: "texto"},
    {clave: 'lastUpdatedBy', valor: 'Última actualización por', tipo: "texto"},
  ];
  actions = [
    {name: 'Editar', icon: "edit", tooltipText: 'Editar', callback: (item: any) => this.openFormDialog(item)},
    {name: 'Eliminar', icon: "delete", tooltipText: 'Eliminar', callback: (item: any) => this.delete(item)},
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private experienciaAgenteService: ExperienciaAgenteService,
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
    this.experienciaAgenteService
      .list({
        ...this.queryParams,
        registrosActivos: !this.queryParams.registrosEliminados,
      })
      .subscribe((response: any) => {
        this.dataList = this.generarTablaPersonalizada(response.data);
        this.totalRecords = response.count;
      });
  }

  // Transformar los datos para la tabla
  generarTablaPersonalizada(data: any): any {
    return data.map((item: any) => ({
      id: item.id,
      dateCreated: item.dateCreated,
      lastUpdated: item.lastUpdated,
      clave: item.clave,
      nombre: item.nombre,
      descripcion: item.descripcion,
      cantidadProspectos: item.cantidadProspectos,
      createdBy: item?.createdBy?.nombre ? `${item?.createdBy.nombre} ${item?.createdBy.apeidoPaterno} ${item?.createdBy.apeidoMaterno}` : '---',
      lastUpdatedBy: item?.lastUpdatedBy?.nombre ? `${item?.lastUpdatedBy?.nombre || ''} ${item?.lastUpdatedBy?.apeidoPaterno || ''} ${item?.lastUpdatedBy?.apeidoMaterno || ''}` : '---',
    }));
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        name: 'filtroGeneral',
        label: 'Clave',
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
          validation: Validators.required
        }
      ],
      [
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          validation: Validators.required
        }
      ],
      [
        {
          name: 'cantidadProspectos',
          label: 'Cantidad de prospectos',
          type: 'number',
          validation: Validators.required
        }
      ],
      [
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'text',
        }
      ],
    ]

    let titleDialog = 'Registrar experiencia agente'
    if (data.id) {
      titleDialog = 'Editar experiencia agente'
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
        this.experienciaAgenteService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.experienciaAgenteService.create(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro creado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
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

    this.experienciaAgenteService.delete(objeto.id).subscribe(() => {
      this.lista();
    });
  }

}
