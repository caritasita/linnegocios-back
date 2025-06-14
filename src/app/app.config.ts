import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {TokenInterceptor} from './core/interceptors/token.interceptor';
import {AuthService} from './core/services/auth.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DatePipe} from '@angular/common';
import {environment} from '../environments/environment';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {FIREBASE_OPTIONS} from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    AuthService,
    MatSnackBarModule,
    provideAnimationsAsync(),
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
};
