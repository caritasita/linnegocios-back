import {Component, Input, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {CommonModule, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-lista-generica',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
  ],
  templateUrl: './lista-generica.component.html',
  styleUrl: './lista-generica.component.css'
})
export class ListaGenericaComponent implements OnInit{
  @Input() data: any= []

  ngOnInit(): void {
    console.log('DATA LISTA');
    console.table(this.data);
  }
}
