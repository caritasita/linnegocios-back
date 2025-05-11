import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from '../../core/interceptors/token.interceptor';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./impuestos-producto/impuestos-producto.component').then(m => m.ImpuestosProductoComponent)
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
  {
    path: 'tipoComprobante',
    loadComponent: () => import('./tipo-comprobante/tipo-comprobante.component').then(m => m.TipoComprobanteComponent)
  },
  {
    path: 'metodoPago',
    loadComponent: () => import('./metodo-pago/metodo-pago.component').then(m => m.MetodoPagoComponent)
  },
  {
    path: 'comprobanteMetodoPago',
    loadComponent: () => import('./comprobante-metodo-pago/comprobante-metodo-pago.component').then(m => m.ComprobanteMetodoPagoComponent)
  },
  {
    path: 'giroComercial',
    loadComponent: () => import('./giro-comercial/giro-comercial.component').then(m => m.GiroComercialComponent)
  },
  {
    path: 'tipoCredito',
    loadComponent: () => import('./tipo-credito/tipo-credito.component').then(m => m.TipoCreditoComponent)
  },
  {
    path: 'tipoSeguimientoNegocio',
    loadComponent: () => import('./tipo-seguimiento-negocio/tipo-seguimiento-negocio.component').then(m => m.TipoSeguimientoNegocioComponent)
  },
  {
    path: 'estatusSeguimientoNegocio',
    loadComponent: () => import('./estatus-seguimiento-negocio/estatus-seguimiento-negocio.component').then(m => m.EstatusSeguimientoNegocioComponent)
  },
  {
    path: 'metaActivacion',
    loadComponent: () => import('./meta-activacion/meta-activacion.component').then(m => m.MetaActivacionComponent)
  },
  {
    path: 'unidadMedida',
    loadComponent: () => import('./unidad-medida/unidad-medida.component').then(m => m.UnidadMedidaComponent)
  },
  {
    path: 'experienciaAgente',
    loadComponent: () => import('./experiencia-agente/experiencia-agente.component').then(m => m.ExperienciaAgenteComponent)
  },
  {
    path: 'impuestosProducto',
    loadComponent: () => import('./impuestos-producto/impuestos-producto.component').then(m => m.ImpuestosProductoComponent)
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
