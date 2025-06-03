import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input, OnChanges,
  OnDestroy,
  OnInit, Optional,
  Output, SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatCardModule} from '@angular/material/card';
import {FormErrorsComponent} from '../form-errors/form-errors.component';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {GenericoService} from '../../core/services/generico.service';
import {Subscription} from 'rxjs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter} from '@angular/material/core';
import {CUSTOM_DATE_FORMATS} from '../../core/config/custom-date-formats';
import {CustomDateAdapter} from '../../core/config/CustomDateAdapter';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@Component({
  selector: 'app-form-dialog-generico',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    FormsModule,
    MatCardModule,
    FormErrorsComponent,
    MatSlideToggle,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-dialog-generico.component.html',
  styleUrl: './form-dialog-generico.component.scss',
})
export class FormDialogGenericoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() fieldForms: FieldForm[] = [];
  @Input() data: any = {};
  @Input() showHeader: boolean = true;
  @Input() titleDialog: string = "Registrar";
  @Input() twoColumn = false;
  @Input() nombreButtonGuardar: string = 'Guardar';
  @Input() nombreBotonCancelar: string = 'Cancelar'
  @Input() mostrarBotonCancelar: Boolean = true;
  @Output() submitForm = new EventEmitter<any>();

  @Input() componente: any; // Componente a recibir
  @Input() datos: any;

  fieldsFlat!: FieldForm[];

  form!: FormGroup;
  forms: { [key: string]: FormGroup } = {};
  searchControls: { [key: string]: FormControl } = {};
  filteredOptions: { [key: string]: any[] } = {};

  private subscription!: Subscription;
  componentRef!: any;

  @ViewChild('contenedorDinamico', {read: ViewContainerRef, static: true}) contenedorDinamico!: ViewContainerRef;

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Optional() public dialogRef: MatDialogRef<FormDialogGenericoComponent>,
    private genericoService: GenericoService
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.fieldForms = this.fieldForms.length > 0 ? this.fieldForms : this.dialogData?.fieldForms;
    this.titleDialog = this.titleDialog ? this.titleDialog : this.dialogData?.titleDialog;
    this.twoColumn = (this.twoColumn ? this.twoColumn : this.dialogData?.twoColumn) || false;
    this.data = this.dialogData?.data || {};

    this.componente = this.componente || this?.dialogData?.componente;
    this.datos = this.datos || this?.dialogData?.datos;

    if (this.componente) {
      this.componentRef = this.contenedorDinamico.createComponent(this.componente);
      this.updateComponentWithDatos();
    }

    for (const key of this.fieldForms) {
      // if(this.fieldForms.hasOwnProperty(key.form)){
      this.forms[key.form] = this.createForm(key.fields)
      // }
    }

    this.listenCheckbox();
    this.obtenerEstatusActualCheckbox();

  }

  private updateComponentWithDatos() {
    // Pasar los nuevos datos al componente proyectado
    if (this.datos) {
      Object.keys(this.datos).forEach(key => {
        (this.componentRef.instance as any)[key] = this.datos[key];
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.componentRef) {
      this.updateComponentWithDatos();
    }
  }


  listenCheckbox() {
    this.subscription = this.genericoService.fieldVisibility$.subscribe((visibility) => {
      this.fieldForms.forEach(ff => {
        if (ff.fields) {
          ff.fields.forEach((field: any) => {
            field.forEach((f: any) => {
              if (f.dependsOn) {
                const partes = f.dependsOn.split('.');
                // if (partes[0] === ff.form) {
                const valorActual = visibility[partes[1]];
                f.visibility = !valorActual;
                // }
              }
            });
          });
        }
      });
    });
  }

  obtenerEstatusActualCheckbox() {
    this.fieldForms.forEach(ff => {
      if (ff.fields) {
        ff.fields.forEach((field: any) => {
          field.forEach((f: any) => {
            if (f.dependsOn) {
              const partes = f.dependsOn.split('.');
              // if (partes[0] === ff.form) {
              let valorActual = this.getValueByPath(this.data, f.dependsOn || '');
              valorActual = (valorActual === null || valorActual === false) ? false : valorActual;
              f.visibility = !valorActual;
              // }
            }
          });
        });
      }
    });
  }

  onCheckboxChange(fieldName: string, event: any) {
    this.genericoService.updateFieldVisibility(fieldName, event?.checked);
  }

  createForm(formulario: any): FormGroup {
    const formGroup: { [key: string]: FormControl | FormGroup } = {}; // Permite FormGroup anidado
    this.fieldsFlat = formulario.flat()
    this.fieldsFlat.forEach((field: any) => {
      if (field.type === 'file') {
        // Crear un FormGroup anidado para el campo "imagen"
        formGroup[field.name] = this.fb.group({
          contentType: [this.data.imagen?.contentType || null],
          nombre: [this.data.imagen?.nombre || null],
          size: [this.data.imagen?.size || null],
          encodeImage: [this.data.imagen?.encodeImage || null]
        });
      } else if (field.type === 'toggle') {
        formGroup[field.name] = new FormControl(
          this.getValueByPath(this.data, field.value || '') || false,
          field.validation
        );
      } else {
        // console.log(`field.name ${field.name}`);
        // Crear un FormControl para los demás campos
        formGroup[field.name] = new FormControl(
          this.getValueByPath(this.data, field.value || '') || '',
          field.validation
        );

        if (field.type === 'select' || field.type === 'multiselect') {
          this.searchControls[field.name] = new FormControl();
          this.filteredOptions[field.name] = field.options; // Inicializa las opciones filtradas

          // Filtrar opciones en base al input de búsqueda
          this.searchControls[field.name].valueChanges.subscribe(value => {
            this.filteredOptions[field.name] = field.options.filter((option: any) => {
              return option.label.toString().toLowerCase().includes(value.toString().toLowerCase());
            });
          });

          // Establecer el valor del FormControl al ID correspondiente
          const selectedOption = this.data[field.name];
          if (field.type === 'select' && selectedOption) {
            // Cuando NO es un objeto se obtiene el valor directo
            formGroup[field.name].setValue(selectedOption.id || selectedOption.clave || selectedOption); // Selecciona el ID a editar
          } else if (field.type === 'multiselect') {
            formGroup[field.name].setValue(
              Array.isArray(selectedOption)
                ? selectedOption.map(option => option.id || option.clave || option) // Mapear los valores seleccionados
                : [selectedOption?.id || selectedOption?.clave || selectedOption]
            ); // Selecciona el ID a editar
          }
        }
      }
    });

    return this.fb.group(formGroup);
  }

  getValueByPath(obj: any, path: string = ''): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getControlNames(formGroup: FormGroup): string[] {
    return Object.keys(formGroup.controls);
  }

  getLabelForValue(field: Field, value: any): string {
    const option = field.options?.find(opt => opt.value === value);
    return option ? option.label : '';
  }

  // Método para obtener las opciones seleccionadas
  getSelectedOptions(nameSalect: any): any[] {
    const selectedValues = nameSalect.value || [];
    return selectedValues;
  }

  onSubmit() {
    if (this.isFormsValid) { // Verifica si todos los formularios son válidos
      const formValues = this.getFormValues(); // Obtiene los valores de los formularios
      this.submitForm.emit(formValues); // Emite los valores hacia el componente padre o servicio
      // this.dialogRef?.close(formValues); // Cierra el diálogo y envía los valores si es necesario
    } else {
      console.error('El formulario no es válido');
    }
  }

  onClose(): void {
    this.dialogRef?.close();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Deshabilitar el evento Enter
    }
  }

  clearField(fieldName: string): void {
    this.form.get(fieldName)?.setValue('');
  }

  imagePreview: string | null = null;

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  getFields(key: string): Field[][] | undefined {
    return this.fieldForms.find((item: any) => item.form === key)?.fields;
  }

  get isFormsValid(): boolean {
    return Object.keys(this.forms).every(key => this.forms[key].valid);
  }

  getFormValues(): any {
    const values: any = {};
    Object.keys(this.forms).forEach(key => {
      values[key] = this.forms[key].value; // Obtiene los valores de cada FormGroup
    });
    return values;
  }
}

export interface FieldForm {
  form: string;
  fields?: Field[][];
}

export interface Field {
  label: string;
  name: string;
  value?: string;
  type: string;
  minLength?: number;
  maxLenght?: number;
  options?: OptionField[];
  validation?: any;
  visibility?: boolean;
  dependsOn?: string;
  fillColumn?: string;
  disabled?: boolean;
}

export interface OptionField {
  label: string;
  value: any;
}
