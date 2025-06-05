import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {CrudService} from './crud.service';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoNegocioService {
  private datosSubject = new Subject();
  datos$ = this.datosSubject.asObservable();

  constructor(private crudService: CrudService) {
  }

  get(id: number): Observable<any> {
    return this.crudService.get(id, UrlServer.seguimientoNegocio);
  }

  list(parametros: any): Observable<any> {
    return this.crudService.list(parametros, UrlServer.seguimientoNegocio);
  }

  create(seguimientoNegocio: any): Observable<any> {
    return this.crudService.create(
      seguimientoNegocio,
      UrlServer.seguimientoNegocio
    );
  }

  updateListSeguimiento() {
    this.datosSubject.next(null);
  }
}
