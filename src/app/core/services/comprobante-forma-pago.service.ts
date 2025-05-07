import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteFormaPagoService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.comprobanteMetodoPago);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.comprobanteMetodoPago);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.comprobanteMetodoPago);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.comprobanteMetodoPago, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarComprobanteMetodoPago);
  }
}
