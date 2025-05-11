import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {UrlServer} from '../helpers/UrlServer';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredencialesFacturacionEmpresaService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.empresaCredencial);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.empresaCredencial);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.empresaCredencial);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.empresaCredencial, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarEmpresaCredencial);
  }
}
