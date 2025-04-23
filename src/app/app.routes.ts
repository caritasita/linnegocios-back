import { Routes } from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'catalogos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/catalogos/catalogos.module').then(m => m.CatalogosModule)
  },
  { path: '**', redirectTo: 'login' } // Redirigir cualquier otra ruta a login
];
