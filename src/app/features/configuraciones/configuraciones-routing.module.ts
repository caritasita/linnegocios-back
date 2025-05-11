import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./variable-sistema/variable-sistema.component').then(m => m.VariableSistemaComponent)
  }, // Ruta por defecto
  {
    path: 'configuracionCaja',
    loadComponent: () => import('./configuracion-caja/configuracion-caja.component').then(m => m.ConfiguracionCajaComponent)
  },
  {
    path: 'configuracionPlan',
    loadComponent: () => import('./configuracion-plan/configuracion-plan.component').then(m => m.ConfiguracionPlanComponent)
  },
  {
    path: 'periodoDePago',
    loadComponent: () => import('./periodo-de-pago/periodo-de-pago.component').then(m => m.PeriodoDePagoComponent)
  },
  {
    path: 'credencialesFacturacion',
    loadComponent: () => import('./credenciales-facturacion-empresa/credenciales-facturacion-empresa.component').then(m => m.CredencialesFacturacionEmpresaComponent)
  },
  {
    path: 'variablesSistema',
    loadComponent: () => import('./variable-sistema/variable-sistema.component').then(m => m.VariableSistemaComponent)
  },

  { path: '**', loadComponent: () => import('./configuracion-caja/configuracion-caja.component').then(m => m.ConfiguracionCajaComponent) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionesRoutingModule { }
