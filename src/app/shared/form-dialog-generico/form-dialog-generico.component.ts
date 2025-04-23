import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

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
    MatInputModule
  ],
  templateUrl: './form-dialog-generico.component.html',
  styleUrl: './form-dialog-generico.component.css',
})
export class FormDialogGenericoComponent implements OnInit {
  @Input() fields: Field[] = [];
  @Input() data: any = {};
  @Input() titleDialog: string = "Registrar";
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<FormDialogGenericoComponent>
  ) {
  }

  ngOnInit() {
    this.fields = this.dialogData.fields;
    this.titleDialog = this.dialogData.titleDialog;
    this.data = this.dialogData.data || {};

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
      this.dialogRef?.close(this.form.value); // Cierra el diálogo si es necesario

    }
  }

  onClose(): void {
    this.dialogRef?.close();
  }
}

export interface Field {
  label: string;
  name: string;
  type: string;
  options?: { label: string; value: any }[];
  validation?: any;
}
