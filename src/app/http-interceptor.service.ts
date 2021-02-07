import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './login/auth.service';


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private authenticationService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authenticationService.isUserLoggedIn() && 
        req.url.indexOf('login') === -1 && 
        req.url.indexOf('logout') === -1 && 
        req.url.indexOf('version') === -1) 
    {
      const authReq = req.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
           Authorization: `Basic ${window.btoa(this.authenticationService.username + ':' + this.authenticationService.password)}`
        })
      });
    
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}


/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
];