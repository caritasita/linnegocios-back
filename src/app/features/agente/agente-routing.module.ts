import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./configuracion-agente/configuracion-agente.component').then(m => m.ConfiguracionAgenteComponent)
  }, // Ruta por defecto
  {
    path: 'configuracionAgente',
    loadComponent: () => import('./configuracion-agente/configuracion-agente.component').then(m => m.ConfiguracionAgenteComponent)
  },
  {
    path: 'saldoAgente',
    loadComponent: () => import('./saldo-agente/saldo-agente.component').then(m => m.SaldoAgenteComponent)
  },
  {
    path: 'movimientoSaldo',
    loadComponent: () => import('./movimiento-saldo/movimiento-saldo.component').then(m => m.MovimientoSaldoComponent)
  },
  {
    path: 'cumplimientoMeta',
    loadComponent: () => import('./cumplimiento-meta/cumplimiento-meta.component').then(m => m.CumplimientoMetaComponent)
  },
  {
    path: '**', loadComponent: () => import('./movimiento-saldo/movimiento-saldo.component').then(m => m.MovimientoSaldoComponent)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgenteRoutingModule { }
