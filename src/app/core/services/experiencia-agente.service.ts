import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaAgenteService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.experienciaAgente);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.experienciaAgente);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.experienciaAgente);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.experienciaAgente, id);
  }

  // recover(id: number): Observable<any> {
  //   return this.crudService.update({ id }, UrlServer.reactivarExperienciaAgente);
  // }
}
