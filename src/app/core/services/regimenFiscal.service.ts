import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class RegimenFiscalService {

  constructor(private crudService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.crudService.list(parametros, UrlServer.regimenFiscal);
  }

  create(data: any): Observable<any> {
    return this.crudService.create(data, UrlServer.regimenFiscal);
  }

  update(data: any): Observable<any> {
    return this.crudService.update(data, UrlServer.regimenFiscal);
  }

  delete(id: number): Observable<any> {
    return this.crudService.delete(UrlServer.regimenFiscal, id);
  }

  recover(id: number): Observable<any> {
    return this.crudService.update({ id }, UrlServer.reactivarRegimenFiscal);
  }
}
