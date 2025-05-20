import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatCardModule} from '@angular/material/card';
import {FormErrorsComponent} from '../form-errors/form-errors.component';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {GenericoService} from '../../core/services/generico.service';

@Component({
  selector: 'app-form-generico',
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
    MatSlideToggle
  ],
  templateUrl: './form-dialog-generico.component.html',
  styleUrl: './form-dialog-generico.component.scss',
})
export class FormDialogGenericoComponent implements OnInit {
  @Input() fieldForms: FieldForm[] = [];
  @Input() data: any = {};
  @Input() titleDialog: string = "Registrar";
  @Output() submitForm = new EventEmitter<any>();

  fieldsFlat!: FieldForm[];

  form!: FormGroup;
  forms: {[key: string]: FormGroup} = {};
  searchControls: { [key: string]: FormControl } = {};
  filteredOptions: { [key: string]: any[] } = {};

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<FormDialogGenericoComponent>,
    private genericoService: GenericoService
  ) {
  }

  ngOnInit() {

    this.fieldForms = this.dialogData.fieldForms;
    this.titleDialog = this.dialogData.titleDialog;
    this.data = this.dialogData.data || {};

    for(const key of this.fieldForms){
      // if(this.fieldForms.hasOwnProperty(key.form)){
        this.forms[key.form] = this.createForm(key.fields)
      // }
    }


    this.genericoService.fieldVisibility$.subscribe((visibility) => {
      this.fieldForms.forEach(ff => {
        if(ff.fields) {
          ff.fields.forEach((field: any) => {
            field.forEach((f: any) =>{
              if(f.dependsOn) {
                const partes = f.dependsOn.split('.')
                if (partes[0] === ff.form) {
                  console.log(`Visibility ${visibility[partes[1]]}`);
                  f.visibility = !visibility[partes[1]];
                }
              }
            })
          });
        }
      })

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
      } else {
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
          } else if(field.type === 'multiselect') {
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
    const values:any = {};
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
