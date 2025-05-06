import { Component } from '@angular/core';
import {LoadingService} from '../../core/services/loading.service';
import {Observable} from 'rxjs';
import {AsyncPipe, CommonModule} from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  loading$: Observable<boolean>;

  constructor(private readonly loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
