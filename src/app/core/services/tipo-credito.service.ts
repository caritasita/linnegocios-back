import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class TipoCreditoService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.tipoCredito);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.tipoCredito);
  }

  update(data: any): Observable<any> {
    console.log('ENTRNDO A UPDATE SERVICE');
    return this.crudService.update(data, UrlServer.tipoCredito);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.tipoCredito, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarTipoCredito);
  }}
