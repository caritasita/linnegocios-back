import {Component, EventEmitter, Inject, input, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Field} from '../form-dialog-generico/form-dialog-generico.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

@Component({
  selector: 'app-form-generico',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    NgxMatSelectSearchModule,
  ],
  templateUrl: './form-generico.component.html',
  styleUrl: './form-generico.component.css',
})
export class FormGenericoComponent implements OnInit {
  @Input() fields: Field[] = [];
  @Input() data: any = {};
  @Input() showHeader: boolean = true;
  @Input() titleDialog: string = 'Registrar';
  @Input() colorFondo: string = '';
  @Input() sinEstilosCard: boolean = false;
  @Input() nombreButtonGuardar: string = 'Guardar';
  @Input() nombreBotonCancelar: string= 'Cancelar'
  @Input() mostrarBotonCancelar: Boolean = true;
  @Output() submitForm = new EventEmitter<any>();
  @Output() resetFormFiltros = new EventEmitter<any>();

  form!: FormGroup;
  searchControls: { [key: string]: FormControl } = {};
  filteredOptions: { [key: string]: any[] } = {};

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    console.log('********* fields');
    console.table(this.fields);
    const formGroup: { [key: string]: FormControl } = {};
    this.fields.forEach((field: any) => {
      formGroup[field.name] = new FormControl(
        this.data[field.name] || '',
        field.validation
      );

      if (field.type === 'select') {
        this.searchControls[field.name] = new FormControl();
        this.filteredOptions[field.name] = field.options; // Inicializa las opciones filtradas

        // Filtrar opciones en base al input de búsqueda
        this.searchControls[field.name].valueChanges.subscribe(value => {
          this.filteredOptions[field.name] = field.options.filter((option: any) =>{
              return option.label.toString().toLowerCase().includes(value.toString().toLowerCase());
            }
          );
        });

        // Establecer el valor del FormControl al ID correspondiente
        const selectedOption = this.data[field.name];
        if (selectedOption) {
          formGroup[field.name].setValue(selectedOption.id); // Selecciona el ID a editar
        }
      }
    });

    this.form = this.fb.group(formGroup);

    //Al editar un registro, el único campo que se deshabilita es la clave.
    if(this.data?.id) {
      this.form.get('clave')?.disable();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  onResetFiltros() {
    this.resetFormFiltros.emit()
    this.form.reset()
  }

  getLabelForValue(field: Field, value: any): string {
    const option = field.options?.find(opt => opt.value === value);
    return option ? option.label : '';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Deshabilitar el evento Enter
    }
  }

  clearField(fieldName: string): void {
    this.form.get(fieldName)?.setValue('');
  }

}
