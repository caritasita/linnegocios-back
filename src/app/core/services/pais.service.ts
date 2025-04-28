import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private entityName = 'Paises';

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.pais);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.pais);
  }

  update(data: any): Observable<any> {
    console.log('ENTRNDO A UPDATE SERVICE');
    return this.crudService.update(data, UrlServer.pais);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.pais, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarPais);
  }
}
