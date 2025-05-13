import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { NegocioRoutingModule } from './negocio-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NegocioRoutingModule,
    DatePipe
  ],
  providers: [DatePipe]
})
export class NegocioModule { }
