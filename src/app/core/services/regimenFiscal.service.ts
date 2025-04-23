import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';

@Injectable({
  providedIn: 'root'
})
export class RegimenFiscalService {

  private entityName = 'Estados';

  constructor(private genericService: CrudService) {}

  get(parametros: any): Observable<any[]> {
    return this.genericService.list(parametros, UrlServer.regimenFiscal);
  }

  create(data: any): Observable<any> {
    return this.genericService.create(this.entityName, data);
  }

  update(data: any): Observable<any> {
    return this.genericService.update(this.entityName, data);
  }

  delete(id: number): Observable<any> {
    return this.genericService.delete(this.entityName, id);
  }
}
