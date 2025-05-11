import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class PeriodoDePagoService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.configuracionCobroMes);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.configuracionCobroMes);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.configuracionCobroMes);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.configuracionCobroMes, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarConfiguracionCobroMes);
  }
}
