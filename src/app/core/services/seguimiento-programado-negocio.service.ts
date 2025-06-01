import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoProgramadoNegocioService {

  constructor(private crudService: CrudService) {
  }

  list(parametros: any): Observable<any> {
    return this.crudService.list(parametros, UrlServer.seguimientoProgramadoNegocio);
  }
}
