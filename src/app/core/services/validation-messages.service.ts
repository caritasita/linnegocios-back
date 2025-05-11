import { Injectable } from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {

  private errorMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio.',
    email: 'El formato del correo electrónico no es válido.',
    minlength: 'El valor es demasiado corto.',
    maxlength: 'El valor es demasiado largo.',
    noEspacios: 'No se permiten espacios en blanco.',
    fueraDeRango: 'El valor está fuera del rango permitido.',
    noCoinciden: 'Los valores no coinciden.',
  };

  getErrorMessage(errorKey: string, errorValue?: any): string {
    switch (errorKey) {
      case 'minlength':
        return `El valor debe tener al menos ${errorValue.requiredLength} caracteres.`;
      case 'maxlength':
        return `El valor no puede exceder ${errorValue.requiredLength} caracteres.`;
      case 'fueraDeRango':
        return `El valor debe estar entre ${errorValue.min} y ${errorValue.max}.`;
      default:
        return this.errorMessages[errorKey] || 'Error desconocido.';
    }
  }

  fueraDeRango(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (valor !== null && (valor < min || valor > max)) {
        return { fueraDeRango: { min, max } };
      }
      return null;
    };
  }
}
