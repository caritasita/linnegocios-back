import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {BehaviorSubject, firstValueFrom} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarGenericoComponent} from '../../shared/snackbar-generico/snackbar-generico.component';
import {DatePipe} from '@angular/common';
import {ErrorDialogComponent} from '../../shared/error-dialog/error-dialog.component';
import {FieldForm} from '../../shared/form-dialog-generico/form-dialog-generico.component';
import {BreakpointObserver} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class GenericoService {

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private breakpointObserver: BreakpointObserver
  ) {}

  confirmDialog(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message }
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  errorDialog(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: { message }
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  openSnackBar(message: string, action: string, classTypeAlert: string, actionCallback: () => void) {
    this.snackBar.openFromComponent(SnackbarGenericoComponent, {
      data: { message, action, actionCallback},
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snack-bar', classTypeAlert]
    });
  }

  getFormatedDateTime(dateTime: any): string | any {
    return this.datePipe.transform(dateTime, 'dd-MM-yyyy h:mm a');
  }

  /*Busca en el json que crear el formulario generico el campo, si lo encuentra le agrega el parametro disabled ya sea true o false*/
  setFieldDisabled(fieldForms: FieldForm[], fieldName: string, disabled: boolean): void {
    for (let form of fieldForms) {
      for (let group of form?.fields || []) {
        for (let field of group) {
          if (field.name === fieldName) {
            field.disabled = disabled; // Cambiar el estado
            return; // Salir de la función después de encontrar y actualizar
          }
        }
      }
    }
    console.log(`Campo '${fieldName}' no encontrado.`);
  }


  private fieldVisibility = new BehaviorSubject<any>({});
  fieldVisibility$ = this.fieldVisibility.asObservable();
  updateFieldVisibility(fieldName: string, value: boolean) {
    const currentState = this.fieldVisibility.getValue();
    currentState[fieldName] = value;
    this.fieldVisibility.next(currentState);
  }

  getDialogSize(): { width: string; height: string } {
    let dialogWidth = '60vw'; // Tamaño por defecto
    let dialogHeight = 'auto';

    // Detectar el tamaño de la pantalla y ajustar el tamaño del diálogo
    if (this.breakpointObserver.isMatched('(max-width: 959px)')) {
      dialogWidth = '95vw'; // Pantallas SM
    } else if (this.breakpointObserver.isMatched('(min-width: 960px) and (max-width: 1365px)')) {
      dialogWidth = '65vw'; // Pantallas MD
    } else if (this.breakpointObserver.isMatched('(min-width: 1366px)')) {
      dialogWidth = '50vw'; // Pantallas LG
    }

    return { width: dialogWidth, height: dialogHeight };
  }


}
