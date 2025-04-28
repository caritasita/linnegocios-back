import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-snackbar-generico',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './snackbar-generico.component.html',
  styleUrl: './snackbar-generico.component.css'
})
export class SnackbarGenericoComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {
    message: string,
    action: string,
    classTypeAlert: string,
    actionCallback: () => void,
  }) {}
}
