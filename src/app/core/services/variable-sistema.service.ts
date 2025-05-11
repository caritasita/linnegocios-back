import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class VariableSistemaService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.variableSistema);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.variableSistema);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.variableSistema);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.variableSistema, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarVariableSistema);
  }
}
