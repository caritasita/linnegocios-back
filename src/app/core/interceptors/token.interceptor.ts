import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import {BehaviorSubject, catchError, filter, map, Observable, switchMap, take, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {GenericoService} from '../services/generico.service';
import {LoadingService} from '../services/loading.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private isRefreshing = false;

  protected currentPetitions: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private genericoService: GenericoService,
    private loadingService: LoadingService
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.loadingService.show();

    const excludeUrl = request.url.includes('login');
    const token = this.authService.getAccesToken();

    if (token) {
      if (!request.url.includes('linntae.mx')) {
        request = this.addToken(request, this.authService.getAccesToken());
      }
      // if (this.authService.isTendero() || this.authService.isCajero() || this.authService.isCajeroAdmin()) {
      //   this.cerrarSesion();
      //   return;
      // }
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });
    if (!request.url.includes('linntae.mx')) {
      request = request.clone({url: environment.apiEndpoint + request.url});
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.onEnd();
        }

        return event;
      }),
      catchError((errorRespuesta: HttpErrorResponse) => {
        let json;
        let data = {};
        let totalErroreshere = 1;
        if (errorRespuesta.status === 422) {
          if (
            typeof errorRespuesta.error === 'string' &&
            errorRespuesta.error.includes('null')
          ) {
            const stri = errorRespuesta.error;
            const newstr = stri.replace('[null]', '');
            json = JSON.parse(newstr);
            if (json._embedded) {
              totalErroreshere = json._embedded.errors.length;
            } else {
              totalErroreshere = 1;
            }
          } else {
            totalErroreshere = 1;
            json = errorRespuesta.error;
          }
          data = {
            errores: json,
            statusText: errorRespuesta.statusText,
            totalErorres: totalErroreshere,
            status: errorRespuesta.status,
          };
          // this.errorDialogService.openDialog(data);
          if (errorRespuesta.error && errorRespuesta.error._embedded && errorRespuesta.error._embedded.errors) {
            const errorMessage = errorRespuesta.error._embedded.errors[0].message;
            this.genericoService.errorDialog(errorMessage)
          }
        } else if (errorRespuesta.status === 401) {
          if (errorRespuesta.error) {
            switch (errorRespuesta.error.message) {
              case 'CredentialsExpiredException':
                this.genericoService.openSnackBar(
                  'Tu conseña ha caducado porfavor cambiarla.',
                  'cerrar',
                  'snack-bar-error',
                  () => {}
                );
                // this.router.navigate(['/changePassword'], {
                //   queryParams: request.body,
                // });
                break;
              case 'AccountExpiredException':
                this.genericoService.openSnackBar(
                  'Tu cuenta ha caducada.',
                  'cerrar',
                  'snack-bar-error',
                  () => {}
                );
                break;
              case 'DisabledException':
                this.genericoService.openSnackBar(
                  'Tu cuenta está deshabilitada.',
                  'cerrar',
                  'snack-bar-error',
                  () => {}
                );
                // this.cerrarSesion();
                break;
              case 'LockedException':
                this.genericoService.openSnackBar(
                  'Tu cuenta esta bloqueada.',
                  'cerrar',
                  'snack-bar-error',
                  () => {}
                );
                break;
              default:
                if (excludeUrl) {
                  this.genericoService.openSnackBar(
                    'Datos de acceso incorrectos',
                    'cerrar',
                    'snack-bar-error',
                    () => {}
                  );
                } else {
                  if (this.authService.isRememberMe()) {
                    return this.handle401Error(request, next);
                  } else {
                    this.cerrarSesion();
                    break;
                  }
                }
            }
          }
        } else if (errorRespuesta.status === 500) {
          this.genericoService.openSnackBar(
            '¡Ups!, lo sentimos :( hay un inconveniente en esta sección.',
            'cerrar',
            'snack-bar-error',
            () => {}
          );
        } else if (errorRespuesta.status === -101) {
          this.genericoService.openSnackBar(
            'Revisar su conectividad de internet.',
            'cerrar',
            'snack-bar-error',
            () => {}
          );
        } else if (errorRespuesta.status === 404) {
          this.genericoService.openSnackBar(
            '¡Ups!, lo sentimos :( Al parecer esta acción no existe.',
            'cerrar',
            'snack-bar-error',
            () => {}
          );
        } else if (errorRespuesta.status === 403) {
          this.genericoService.openSnackBar(
            'No tienes permisos necesarios',
            'cerrar',
            'snack-bar-error',
            () => {}
          );
        } else if (errorRespuesta.status === 0) {
          this.genericoService.openSnackBar(
            '¡Ups! lo sentimos, No hay respuesta del servidor',
            'cerrar',
            'snack-bar-error',
            () => {}
          );
        } else {
          this.genericoService.openSnackBar(
            'Presentamos intermitencia, porfavor intentar más tarde.',
            'cerrar',
            'snack-bar-error',
            () => {}
          );

        }
        this.onEnd();
        return throwError(errorRespuesta);
      })
    );
  }

  private cerrarSesion(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.genericoService.openSnackBar(
      'Sesión terminada',
      'cerrar',
      'snack-bar-error',
      () => {}
    );
    // this.onEnd();
    this.router.navigate(['/login']);
  }


  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no cache',
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(
            this.addToken(request, this.authService.getAccesToken())
          );
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt.toString()));
        })
      );
    }
  }

  private onEnd(): void {
    this.loadingService.hide();
  }
}
