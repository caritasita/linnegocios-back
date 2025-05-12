import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.user);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.user);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.user);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.user, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarUser);
  }
}
