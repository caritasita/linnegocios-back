import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./user/user.component').then(m => m.UserComponent)
  }, // Ruta por defecto
  {
    path: 'role',
    loadComponent: () => import('./role/role.component').then(m => m.RoleComponent)
  },
  {
    path: 'user',
    loadComponent: () => import('./user/user.component').then(m => m.UserComponent)
  },

  { path: '**', loadComponent: () => import('./user/user.component').then(m => m.UserComponent) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
