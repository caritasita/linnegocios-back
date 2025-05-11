import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class TipoSeguimientoService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.tipoSeguimientoNegocio);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.tipoSeguimientoNegocio);
  }

  update(data: any): Observable<any> {
    console.log('ENTRNDO A UPDATE SERVICE');
    return this.crudService.update(data, UrlServer.tipoSeguimientoNegocio);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.tipoSeguimientoNegocio, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarTipoSeguimientoNegocio);
  }
}
