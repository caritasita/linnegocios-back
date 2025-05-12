import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.role);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.role);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.role);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.role, id);
  }

  // recover(id: number): Observable<any> {
  //   return this.crudService.update({ id }, UrlServer.reactivarRole);
  // }
}
