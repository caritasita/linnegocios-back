import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class RegimenFiscalService {

  constructor(private genericService: CrudService) {}

  list(parametros: any): Observable<any[]> {
    return this.genericService.list(parametros, UrlServer.regimenFiscal);
  }

  create(data: any): Observable<any> {
    return this.genericService.create(data, UrlServer.regimenFiscal);
  }

  update(data: any): Observable<any> {
    return this.genericService.update(data, UrlServer.regimenFiscal);
  }

  delete(id: number): Observable<any> {
    return this.genericService.delete(UrlServer.regimenFiscal, id);
  }
}
