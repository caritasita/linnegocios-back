import {Injectable} from '@angular/core';
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
    telefonoInvalido: 'El número de teléfono debe tener 10 dígitos.',
  };

  getErrorMessage(errorKey: string, errorValue?: any): string {
    switch (errorKey) {
      case 'minlength':
        return `El valor debe tener al menos ${errorValue.requiredLength} caracteres.`;
      case 'maxlength':
        return `El valor no puede exceder ${errorValue.requiredLength} caracteres.`;
      case 'fueraDeRango':
        return `El valor debe estar entre ${errorValue.min} y ${errorValue.max}.`;
      case 'soloNumeros':
        return `Solo se aceptan números.`;
      case 'telefonoValido':
        return `Solo se aceptan números.`;
      default:
        return this.errorMessages[errorKey] || 'Error desconocido.';
    }
  }

  fueraDeRango(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (valor !== null && (valor < min || valor > max)) {
        return {fueraDeRango: {min, max}};
      }
      return null;
    };
  }

  telefonoValido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      const telefonoRegex = /^[0-9]{10}$/; // Expresión regular para 10 dígitos numéricos
      if (valor && !telefonoRegex.test(valor)) {
        return {telefonoInvalido: true};
      }
      return null;
    };
  }

  soloNumeros(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      const esNumero = /^[0-9]*$/.test(valor); // Valida que solo haya números
      return esNumero ? null : {soloNumeros: true}; // Devuelve un error si no es válido
    };
  }
}
