import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudService} from './crud.service';
import {first, Observable} from 'rxjs';
import {UrlServer} from '../helpers/UrlServer';
import {HorarioSoporte} from '../../shared/models/horarioSoporte';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BuzonService {

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private crudService: CrudService
  ) {
  }

  public list(params: any = null): Observable<any> {
    return this.crudService.list(params, UrlServer.buzonSoporte);
  }

  public getBuzon(id: number): Observable<any> {
    return this.http.get<any>(UrlServer.buzonSoporte + '/' + id);
  }

  public update(payload: any): Observable<any> {
    return this.http.put(UrlServer.buzonSoporte + `/${payload.id}`, payload);
  }


  public getHorarioSoporteList(): Observable<any> {
    return this.http.get(UrlServer.horarioSoporte);
  }

  public getHorarioSoporte(horario: HorarioSoporte): Observable<HorarioSoporte> {
    return this.http.get<any>(UrlServer.horarioSoporte + '/show', {params: {dia: '' + (horario.dia === 7 ? 0 : horario.dia)}});
  }

  public refreshHorario(): Observable<any> {
    return this.firestore.collection('horarioSoporte').valueChanges();
  }

  public setHorarioStatus(payload: any = {}): Observable<any> {
    return this.http.put(UrlServer.setHorarioSoporte, payload);
  }

  public setHorario(payload: any = {}): void {
    this.http.put(UrlServer.setHoursHorarioSoporte, payload).pipe(first()).subscribe();
  }
}
