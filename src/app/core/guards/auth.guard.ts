import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('user_access'); // Verifica si hay un token en localStorage
    if (!isAuthenticated) {
      this.router.navigate(['/login']).then(r => {
        window.location.reload(); // Esto recargará la página
      });
      return false;
    }
    return true; // Permitir acceso si está autenticado
  }
}
