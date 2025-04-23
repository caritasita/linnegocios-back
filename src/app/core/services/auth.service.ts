import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {User} from '../../shared/models/User';
import {map, Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment.development';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string, rememberMe: boolean) {
    const params = { username, password };
    return this.http.post<User>(`api/login`, params).pipe(
      map((user) => {
        // const roles = user.roles || [];
        // if (roles.some(role => this.BLOCKED_ROLES.includes(role))) {
        //   const message = 'Usuario o contraseña incorrectos';
        //   this.genericoService.showSnackBarMessage(message);
        //   throw new Error(message);
        // }
        // user['rememberme'] = rememberMe;
        this.setSession(user);
      })
    );
  }

  public setSession(loginInfo: any) {
    const exp = new Date();
    exp.setSeconds(exp.getSeconds() + loginInfo.expires_in);

    const dataJson = {
      accessToken: loginInfo.access_token,
      username: loginInfo.username,
      refreshToken: loginInfo.refresh_token,
      expiresAt: exp.getTime(),
      roles: loginInfo.roles,
      rememberme: loginInfo.rememberme,
    };
    localStorage.setItem('user_access', btoa(JSON.stringify(dataJson)));
  }

  public setUserInfo(loginInfo: any) {
    localStorage.setItem('user_info', btoa(JSON.stringify(loginInfo)));
  }

  getAccesToken() {
    return this.getKeyLocalStorage('accessToken');
  }

  getKeyLocalStorage(key: string) {
    const storage = this.getLocalStorage();
    if (storage) {
      return storage[key];
    } else {
      return null;
    }
  }

  getLocalStorage() {
    const locaStorage = localStorage.getItem('user_access');
    if (locaStorage) {
      return JSON.parse(atob(locaStorage));
    } else {
      return null;
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no cache',
      },
    });
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getKeyLocalStorage('refreshToken');
    return this.http
      .post<any>(
        'oauth/access_token?grant_type=refresh_token&refresh_token=' +
        refreshToken,
        {},
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      .pipe(
        tap((objecto) => {
          objecto['rememberme'] = true;
          this.setSession(objecto);
        })
      );
  }

  isRememberMe() {
    const isRemermee = this.getKeyLocalStorage('rememberme');
    return isRemermee;
  }
}
