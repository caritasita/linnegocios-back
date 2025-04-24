import {Component, OnInit} from '@angular/core';
import {FormGenericoComponent} from '../../shared/form-generico/form-generico.component';
import {Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Route, Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../core/services/auth.service';
import {UrlServer} from '../../core/helpers/UrlServer';
import {first} from 'rxjs';
import {CrudService} from '../../core/services/crud.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from '../../core/interceptors/token.interceptor';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormGenericoComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    AuthService, CrudService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
  ]
})
export class LoginComponent implements OnInit {

  fields= [
    {
      label: 'Usuario',
      name: 'username',
      type: 'text',
      validation: [Validators.required]
    },
    {
      label: 'Contraseña',
      name: 'password',
      type: 'text',
      validation: [Validators.required]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private crudSerivce: CrudService
  ) {
  }
  ngOnInit() {
  }

  iniciarSesion(event: any): void {

    const {username, password} = event
    this.authService
      .login(username, password, false)
      .subscribe((response:any) => {
        this.crudSerivce
          .list({}, UrlServer.profile)
          .pipe(first())
          .subscribe((userInfo: any) => {
            this.authService.setUserInfo(userInfo?.user);
            location.reload();
          });

        console.log('response');
        console.log(response);
      });
  }


}
