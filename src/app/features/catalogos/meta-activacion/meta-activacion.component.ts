import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FieldForm,
  FormDialogGenericoComponent
} from '../../../shared/form-dialog-generico/form-dialog-generico.component';
import {TablaGenericaComponent} from '../../../shared/tabla-generica/tabla-generica.component';
import {GenericoService} from '../../../core/services/generico.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {ActionsTabla, ColumnasTabla} from '../pais/pais.component';
import {MetaActivacionService} from '../../../core/services/meta-activacion.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {ValidationMessagesService} from '../../../core/services/validation-messages.service';
import {hasPermission} from '../../../core/helpers/utilities';
import {permisosMetaActivacion} from '../../../core/helpers/permissions.data';

@Component({
  selector: 'app-meta-activacion',
  standalone: true,
  imports: [
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
    TablaGenericaComponent,
    FormDialogGenericoComponent
  ],
  templateUrl: './meta-activacion.component.html',
  styleUrl: './meta-activacion.component.css'
})
export class MetaActivacionComponent implements OnInit {
  dataList: any[] = [];
  totalRecords: number = 0;
  fieldsFilters!: FieldForm[];
  queryParams = {
    max: 10,
    offset: 0,
    filtroGeneral: '',
    registrosEliminados: false,
  };
  columns: ColumnasTabla[] = [
    {clave: 'dateCreated', valor: 'Fecha de registro', tipo: "fecha"},
    {clave: 'lastUpdated', valor: 'Última actualización', tipo: "fecha"},
    {clave: 'clave', valor: 'Clave', tipo: "texto"},
    {clave: 'porcentajeMeta', valor: 'Meta', tipo: "porcentaje"},
    {clave: 'bonoExtra', valor: 'Bono extra al final del mes por cumplimiento de meta', tipo: "moneda"},
    {clave: 'createdBy', valor: 'Registrado por', tipo: "text"},
    {clave: 'lastUpdatedBy', valor: 'Última actualización por', tipo: "texto"},
  ];

  actions: ActionsTabla[] = [
    {
      name: 'Editar',
      icon: "edit",
      tooltipText: 'Editar',
      callback: (item: any) => this.openFormDialog(item),
      hideAction: (item: any) => {
        return hasPermission(permisosMetaActivacion.update)
      }
    },
    {
      name: 'Eliminar',
      icon: "delete",
      tooltipText: 'Eliminar',
      callback: (item: any) => this.delete(item),
      hideAction: (item: any) => {
        return hasPermission(permisosMetaActivacion.delete)
      }
    }
  ];

  @ViewChild('tablaGenerica') tablaGenerica!: TablaGenericaComponent;

  constructor(
    private metaActivacionService: MetaActivacionService,
    private genericoService: GenericoService,
    private dialog: MatDialog,
    private validationMessagesService: ValidationMessagesService,
  ) {
  }

  ngOnInit() {
    this.lista();
  }

  lista(resetOffset = false) {
    if (resetOffset) {
      this.queryParams.offset = 0;
    }
    this.metaActivacionService
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
      id: item?.id,
      dateCreated: item?.dateCreated,
      lastUpdated: item?.lastUpdated,
      clave: item?.clave,
      porcentajeMeta: item?.porcentajeMeta,
      bonoExtra: item?.bonoExtra,
      createdBy: item?.createdBy?.nombre ? `${item?.createdBy?.nombre || ''} ${item?.createdBy?.apeidoPaterno || ''} ${item?.createdBy?.apeidoMaterno || ''}` : '---',
      lastUpdatedBy: item?.lastUpdatedBy?.nombre ? `${item?.lastUpdatedBy?.nombre || ''} ${item?.lastUpdatedBy?.apeidoPaterno || ''} ${item?.lastUpdatedBy?.apeidoMaterno || ''}` : '---',
    }));
  }

  formFiltros(): void {
    this.fieldsFilters = [
      {
        form: 'metaActivacion',
        fields: [
          [
            {
              name: 'filtroGeneral',
              label: 'Clave',
              type: 'text',
            },
          ]
        ]
      }


    ]
  }

  procesarfiltros(form: any) {
    this.queryParams = ({...this.queryParams, ...form.metaActivacion});
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

    const fieldForms: FieldForm[] = [
      {
        form: 'metaActivacion',
        fields: [
          [
            {
              name: 'clave',
              label: 'Clave',
              value: 'clave',
              type: 'text',
              validation: Validators.required
            }
          ],
          [
            {
              name: 'porcentajeMeta',
              label: 'Porcentaje meta',
              value: 'porcentajeMeta',
              type: 'number',
              validation: Validators.compose([Validators.required, this.validationMessagesService.fueraDeRango(1, 100)])
            }
          ],
          [
            {
              name: 'bonoExtra',
              label: 'Bono extra por cumplimiento de meta',
              value: 'bonoExtra',
              type: 'text',
              validation: Validators.required
            }
          ]
        ]
      }
    ]

    let titleDialog = 'Registrar meta de activación'
    if (data.id) {
      titleDialog = 'Editar meta de activación';
      this.genericoService.setFieldDisabled(fieldForms, 'clave', true);
    }

    const dialogRef = this.dialog.open(FormDialogGenericoComponent, {
      data: {
        titleDialog: titleDialog,
        fieldForms,
        data
      },
      disableClose: true,
      width: '50vw',
    });

    dialogRef.componentInstance.submitForm.subscribe(result => {

      if (data.id) {
        result = ({...result, id: data.id})
        this.metaActivacionService.update(result).subscribe((respueta) => {
          if (respueta) this.genericoService.openSnackBar('Registro actualizado exitosamente', 'Aceptar', 'snack-bar-success', () => {
          });
          this.lista();
        });
      } else {
        this.metaActivacionService.create(result).subscribe((respueta) => {
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

    this.metaActivacionService.delete(objeto.id).subscribe(() => {
      this.lista();
    });
  }
}
