import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class GiroComercialService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.giroComercial);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.giroComercial);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.giroComercial);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.giroComercial, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarGiroComercial);
  }
}
