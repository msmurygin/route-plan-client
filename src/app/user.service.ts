import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ControllerURL } from 'src/environments/controllers';
import { RestService } from './rest-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private service : RestService, private cookieService : CookieService,
    private router : Router) {
   
  }


  logIn(login: string, password: string){
    console.log(" In the login ")
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'username': login,
      'password': password,
      }),
      //withCredentials: true 
    };

    this.service.getWithHeader(ControllerURL.LOGIN, httpOptions).subscribe(response => {
      this.cookieService.set('username', response['user'].loginId)
      this.cookieService.set('token', response['token'])
      this.router.navigateByUrl("/");
    });
  }
}
