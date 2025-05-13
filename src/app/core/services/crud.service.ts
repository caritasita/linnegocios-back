import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) {}

  list(p: {}, url: string): Observable<any[]> {
    return this.http.get<any[]>(url, {params: p});
  }

  create(object: any, url: string): Observable<any> {
    return this.http.post<any>(url, object).pipe(map(objeto => {
      return objeto;
    }));
  }

  update(object: any, url: string): Observable<any> {
    return this.http.put(url + '/' + object.id, object);
  }

  delete(url: string, id: number): Observable<any> {
    return this.http.delete(`${url}/${id}`);
  }

  updateById(object: any, url: string): Observable<any> {
    if (object.id) {
      url = url + '/' + object.id;
    }
    return this.http.put(url, object).pipe(map(data => {
      return data;
    }));
  }
}
