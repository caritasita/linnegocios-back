import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class MetaActivacionService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.metaActivacion);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.metaActivacion);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.metaActivacion);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.metaActivacion, id);
  }

  // recover(id: number): Observable<any> {
  //   return this.crudService.update({ id }, UrlServer.reactivarPais);
  // }
}
