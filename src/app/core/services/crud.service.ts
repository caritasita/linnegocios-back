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

  get<T>(id: any, url: string, parametros?: {}): Observable<T> {
    url = url + (id != null ? '/' + id : '');
    return this.http.get<T>(url, { params: parametros || {} }).pipe(
      map(this.extractData)
    );
  }

  private extractData<T>(res: T): T {
    return res || {} as T;
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

  // private extractData(res: Response) {
  //   const body = res;
  //   return body || {};
  // }
}
