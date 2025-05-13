import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {firstValueFrom} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarGenericoComponent} from '../../shared/snackbar-generico/snackbar-generico.component';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GenericoService {

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ) {}

  confirmDialog(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
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


}
