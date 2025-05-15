import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
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
    public dialogRef: MatDialogRef<FormDialogGenericoComponent>
  ) {
  }

  ngOnInit() {

    this.fieldForms = this.dialogData.fieldForms;
    this.titleDialog = this.dialogData.titleDialog;
    this.data = this.dialogData.data || {};
    console.log('this.fieldForms');
    console.table(this.fieldForms);

    // this.fieldsFlat= this.fields.flat()

    for(const key of this.fieldForms){
      // if(this.fieldForms.hasOwnProperty(key.form)){
        this.forms[key.form] = this.createForm(key.fields)
      console.log(`this.forms ${key.form}`);
      console.table(this.forms[key.form].controls);
      // }
    }



    //Al editar un registro, el único campo que se deshabilita es la clave.
    if (this.data?.id) {
      this.form.get('clave')?.disable();
    }
  }

  createForm(formulario: any): FormGroup {
    console.log('formulario');
    console.table(formulario);
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
          this.data[field.name] || '',
          field.validation
        );

        if (field.type === 'select') {
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
          if (selectedOption) {
            // Cuando NO es un objeto se obtiene el valor directo
            formGroup[field.name].setValue(selectedOption.id || selectedOption.clave || selectedOption); // Selecciona el ID a editar
          }
        }
      }
    });

    return this.fb.group(formGroup);
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getControlNames(formGroup: FormGroup): string[] {
    console.log('Object.keys(formGroup.controls)');
    console.table(Object.keys(formGroup.controls));
    return Object.keys(formGroup.controls);
  }

  getLabelForValue(field: Field, value: any): string {
    const option = field.options?.find(opt => opt.value === value);
    return option ? option.label : '';
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
      this.dialogRef?.close(this.form.value); // Cierra el diálogo si es necesario

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
}

export interface FieldForm {
  form: string;
  fields?: Field[][];
}

export interface Field {
  label: string;
  name: string;
  type: string;
  maxLenght?: number;
  options?: OptionField[];
  validation?: any;
  hideInput?: boolean;
  fillColumn?: string;
}

export interface OptionField {
  label: string;
  value: any;
}
