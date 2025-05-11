import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionCajaService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.configuracionCaja);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.configuracionCaja);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.configuracionCaja);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.configuracionCaja, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarConfiguracionCaja);
  }
}
