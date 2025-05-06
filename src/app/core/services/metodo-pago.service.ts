import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.metodoDePago);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.metodoDePago);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.metodoDePago);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.metodoDePago, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarMetodoDePago);
  }}
