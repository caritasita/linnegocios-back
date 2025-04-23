import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private entityName = 'estado';

  constructor(private genericService: CrudService) {}

  get(parametros: any): Observable<any[]> {
    return this.genericService.list(parametros, UrlServer.estado);
  }

  create(data: any): Observable<any> {
    return this.genericService.create(data, UrlServer.estado);
  }

  update(data: any): Observable<any> {
    console.log('ENTRNDO A UPDATE SERVICE');
    return this.genericService.update(data, UrlServer.estado);
  }

  delete(id: number): Observable<any> {
    return this.genericService.delete(UrlServer.estado, id);
  }
}
