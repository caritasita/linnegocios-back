import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {EstadoComponent} from './estado/estado.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CatalogosRoutingModule,
    MatCardModule,
    MatToolbarModule,
    EstadoComponent
  ]
})
export class CatalogosModule { }
