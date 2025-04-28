import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.estado);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.estado);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.estado);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.estado, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarEstado);
  }
}
