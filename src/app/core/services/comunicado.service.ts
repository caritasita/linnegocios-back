import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';
import {User} from '../../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {

  constructor(private crudService: CrudService) {
  }

  list(params = {}): Observable<any> {
    return this.crudService.list(params, UrlServer.comunicado);
  }

  get(id: number): Observable<any> {
    return this.crudService.get(id, UrlServer.comunicado);
  }

  create(params: any): Observable<any> {
    return this.crudService.create(params, UrlServer.comunicado);
  }

  update(params: any): Observable<any> {
    return this.crudService.update(params, UrlServer.comunicado);
  }

  delete(id: number): Observable<void> {
    return this.crudService.delete(UrlServer.comunicado, id);
  }

  reactivate(id: number): Observable<User> {
    return this.crudService.update({id}, UrlServer.reactivarComunicado);
  }
}
