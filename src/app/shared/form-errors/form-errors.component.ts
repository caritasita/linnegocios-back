import {Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {ValidationMessagesService} from '../../core/services/validation-messages.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-form-errors',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './form-errors.component.html',
  styleUrl: './form-errors.component.css'
})
export class FormErrorsComponent {
  @Input() control!: AbstractControl | null;

  constructor(private validationMessagesService: ValidationMessagesService) {}

  errorKeys(): string[] {
    return this.control ? Object.keys(this.control?.errors || {}) : [];
  }

  getErrorMessage(errorKey: string, errorValue?: any): string {
    return this.validationMessagesService.getErrorMessage(errorKey, errorValue);
  }
}
