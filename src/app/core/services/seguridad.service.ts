import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private auth: AuthService) {
  }

  isAdmin() {
    return this.auth.getRoles().includes('ROLE_ADMIN');
  }

  isAdminEmpresa() {
    return (
      this.auth.getRoles().includes('ROLE_ADMIN_EMPRESA') ||
      this.auth.getRoles().includes('ROLE_ADMIN')
    );
  }

  isCajero() {
    return (
      this.auth.getRoles().includes('ROLE_CAJERO') ||
      this.auth.getRoles().includes('ROLE_ADMIN') ||
      this.auth.getRoles().includes('ROLE_ADMIN_EMPRESA')
    );
  }

  isCajeroAdmin() {
    return (
      this.auth.getRoles().includes('ROLE_CAJERO_ADMIN') ||
      this.auth.getRoles().includes('ROLE_ADMIN') ||
      this.auth.getRoles().includes('ROLE_ADMIN_EMPRESA')
    );
  }

  isTendero() {
    return (
      this.auth.getRoles().includes('ROLE_TENDERO') ||
      this.auth.getRoles().includes('ROLE_ADMIN') ||
      this.auth.getRoles().includes('ROLE_ADMIN_EMPRESA')
    );
  }

  // TODO : Esta evaluación puede cambiar conforme actualizaciones futururas
  isSoporte() {
    return (
      this.auth.getRoles().includes('ROLE_SOPORTE')
    );
  }

  // TODO : Esta evaluación puede cambiar conforme actualizaciones futururas
  isVentas() {
    return (
      this.auth.getRoles().includes('ROLE_VENTAS')
    );
  }

  isProduction(): boolean {
    return environment.production;
  }

  isDemo(): boolean {
    return environment.demo;
  }

  isAdminAndNotProductionAndNotDemo(): boolean {
    return this.isAdmin() && !this.isProduction() && !this.isDemo();
  }
}
