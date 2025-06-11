import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./buzon/buzon.component').then(m => m.BuzonComponent)
  }, // Ruta por defecto
  {
    path: 'negocio',
    loadComponent: () => import('./negocio/negocio.component').then(m => m.NegocioComponent)
  },
  {
    path: 'comunicado',
    loadComponent: () => import('./comunicado/comunicado.component').then(m => m.ComunicadoComponent)
  },
  {
    path: 'publicidad',
    loadComponent: () => import('./publicidad/publicidad.component').then(m => m.PublicidadComponent)
  },
  {
    path: 'buzon',
    loadComponent: () => import('./buzon/buzon.component').then(m => m.BuzonComponent)
  },
  {
    path: 'horarioSoporte',
    loadComponent: () => import('./horario-soporte/horario-soporte.component').then(m => m.HorarioSoporteComponent)
  },
  {
    path: 'historialChat',
    loadComponent: () => import('./historial-chat/historial-chat.component').then(m => m.HistorialChatComponent)
  },
  {
    path: 'credencialElectronico',
    loadComponent: () => import('./credencial-electronico/credencial-electronico.component').then(m => m.CredencialElectronicoComponent)
  },
  {
    path: 'licencia',
    loadComponent: () => import('./licencia/licencia.component').then(m => m.LicenciaComponent)
  },
  { path: '**', loadComponent: () => import('./negocio/negocio.component').then(m => m.NegocioComponent) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NegocioRoutingModule { }
