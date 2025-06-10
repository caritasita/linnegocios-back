import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';
import {User} from '../../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class PublicidadService {

  constructor(private crudService: CrudService) {
  }

  list(params = {}): Observable<any> {
    return this.crudService.list(params, UrlServer.marketing);
  }

  get(id: number): Observable<any> {
    return this.crudService.get(id, UrlServer.marketing);
  }

  create(params: any): Observable<any> {
    return this.crudService.create(params, UrlServer.marketing);
  }

  update(params: any): Observable<any> {
    return this.crudService.update(params, UrlServer.marketing);
  }

  delete(id: number): Observable<void> {
    return this.crudService.delete(UrlServer.marketing, id);
  }

  reactivate(id: number): Observable<User> {
    return this.crudService.update({id}, UrlServer.reactivarMarketing);
  }
}
