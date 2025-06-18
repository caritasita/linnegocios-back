import { Injectable } from '@angular/core';
import {UrlServer} from '../helpers/UrlServer';
import {CrudService} from './crud.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LicenciaPagoService {

  constructor(private crudService: CrudService) {
  }

  list(params: any = {}): Observable<any> {
    return this.crudService.list(params, UrlServer.reportePagoLicencias);
  }
}
