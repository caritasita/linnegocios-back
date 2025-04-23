import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from '../../core/interceptors/token.interceptor';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./estado/estado.component').then(m => m.EstadoComponent)
  }, // Ruta por defecto
  {
    path: 'pais',
    loadComponent: () => import('./pais/pais.component').then(m => m.PaisComponent)
  },
  {
    path: 'estado',
    loadComponent: () => import('./estado/estado.component').then(m => m.EstadoComponent)
  },
  {
    path: 'regimenFiscal',
    loadComponent: () => import('./regimen-fiscal/regimen-fiscal.component').then(m => m.RegimenFiscalComponent)
  },
  { path: '**', loadComponent: () => import('./pais/pais.component').then(m => m.PaisComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ]
})
export class CatalogosRoutingModule { }
