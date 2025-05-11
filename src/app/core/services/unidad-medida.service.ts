import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {UrlServer} from '../helpers/UrlServer';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.unidadMedida);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.unidadMedida);
  }

  update(data: any): Observable<any> {
    console.log('ENTRNDO A UPDATE SERVICE');
    return this.crudService.update(data, UrlServer.unidadMedida);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.unidadMedida, id);
  }

  // recover(id: number): Observable<any> {
  //   return this.crudService.update({ id }, UrlServer.reactivarPais);
  // }
}
