import {Component, Input, OnInit} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatList, MatListItem} from '@angular/material/list';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-log-seguimiento-negocio',
  standalone: true,
  imports: [
    MatTabsModule,
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
    NgForOf,
    DatePipe
  ],
  templateUrl: './log-seguimiento-negocio.component.html',
  styleUrl: './log-seguimiento-negocio.component.scss'
})
export class LogSeguimientoNegocioComponent implements OnInit {

  @Input() seguimientoList: any;
  @Input() seguimientoProgramadoList: any;

  ngOnInit() {
  }

}
