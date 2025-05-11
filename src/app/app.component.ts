import {Component, HostListener, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from './core/interceptors/token.interceptor';
import {MatCardModule} from '@angular/material/card';
import {LoadingComponent} from './features/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    RouterLink,
    CommonModule,
    MatCardModule,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},]
})
export class AppComponent implements OnInit {
  title = 'linnegocios-back';

  isMobileView!: boolean;
  isSidenavOpen = false;
  isAuthenticated: boolean = false;
constructor(private router: Router) {
}
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileView = event.target.innerWidth <= 768;
  }

  ngOnInit() {
    this.isMobileView = window.innerWidth <= 768;
    console.log('isMobil');
    console.log(`${this.isMobileView}`);

    this.isAuthenticated = !!localStorage.getItem('user_access');
    if(this.isAuthenticated){
      this.router.navigateByUrl('/configuraciones').then((r) => {});
    }
  }

  logout(): void{

    localStorage.removeItem('user_access');
    localStorage.removeItem('user_info');
    const token= !!localStorage.getItem('user_access');
    if(!token) {
      this.router.navigate(['/login'])
      // Esto recargará la página
      window.location.reload();
      // Recargar la página si es necesario
      this.isAuthenticated = !!localStorage.getItem('user_access');
    }
  }
  toggleSidenav(){
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
