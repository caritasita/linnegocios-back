import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class ImpuestosProductoService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.impuestoProducto);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.impuestoProducto);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.impuestoProducto);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.impuestoProducto, id);
  }

  listTiposImpuesto(): Observable<string[]> {
    return this.crudService.list({}, UrlServer.listTiposImpuesto);
  }

  // recover(id: number): Observable<any> {
  //   return this.crudService.update({ id }, UrlServer.reactivarImpuestoProducto);
  // }
}
