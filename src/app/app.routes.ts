import { Routes } from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'tablero',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/tablero/tablero.component').then(m => m.TableroComponent)
  },
  {
    path: 'catalogos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/catalogos/catalogos.module').then(m => m.CatalogosModule)
  },
  {
    path: 'configuraciones',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/configuraciones/configuraciones.module').then(m => m.ConfiguracionesModule)
  },
  { path: '**', redirectTo: 'login' } // Redirigir cualquier otra ruta a login
];
