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
    MatSelectModule
  ],
  templateUrl: './form-generico.component.html',
  styleUrl: './form-generico.component.css',
})
export class FormGenericoComponent implements OnInit {
  @Input() fields: Field[] = [];
  @Input() data: any = {};
  @Input() titleDialog: string = 'Registrar';
  @Input() colorFondo: string = '';
  @Input() titleButtonGuardar: string = 'Guardar';
  @Input() mostrarBotonCancelar: Boolean = true;
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    const formGroup: { [key: string]: FormControl } = {};
    this.fields.forEach((field: any) => {
      formGroup[field.name] = new FormControl(
        this.data[field.name] || '',
        field.validation
      );
    });

    this.form = this.fb.group(formGroup);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  protected readonly input = input;
}
