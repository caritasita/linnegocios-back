import { Injectable } from '@angular/core';
import {UrlServer} from '../helpers/UrlServer';
import {Observable} from 'rxjs';
import {CrudService} from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.negocio);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.negocio);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.negocio);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.negocio, id);
  }

  // recover(id: number): Observable<any> {
  //   return this.crudService.update({ id }, UrlServer.reactivarNe);
  // }
}
