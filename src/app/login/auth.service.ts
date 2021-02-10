import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import { ControllerURL } from 'src/environments/controllers';


export interface IUserContext {
    userName : string;
    fullyQualifiedName : string;
    roles : string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser';
  TOKEN_SESSION_ATTRIBUTE_NAME = 'token';
  USER_OBJECT_SESSION_ATTRIBUTE = "usrObject"

  public username: string;
  public password: string;
  public userObject : IUserContext ;
  public auth   : string;

  constructor(private http: HttpClient) { 
    this.username = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    this.auth = sessionStorage.getItem(this.TOKEN_SESSION_ATTRIBUTE_NAME);
    this.userObject = JSON.parse(sessionStorage.getItem(this.USER_OBJECT_SESSION_ATTRIBUTE) ?  sessionStorage.getItem(this.USER_OBJECT_SESSION_ATTRIBUTE) : "{}" );
  }

  authenticationService(username: string, password: string): Observable<any> {
    return this.http.get(ControllerURL.LOGIN,
      { headers: { authorization: this.createBasicAuthToken(username, password) } }).pipe( map ((res) => {
      this.registerSuccessfulLogin(username, password);
      this.userObject = {
        userName : res['userName'],
        fullyQualifiedName : res['fullyQualifiedName'],
        roles : res['roles']
      }
      sessionStorage.setItem(this.USER_OBJECT_SESSION_ATTRIBUTE, JSON.stringify(this.userObject));
    }));
  }

  createBasicAuthToken(username: string, password: string): string  {
    let token = 'Basic ' + window.btoa(username + ':' + password);
    this.auth = token;
    sessionStorage.setItem(this.TOKEN_SESSION_ATTRIBUTE_NAME, token);
    return token;
  }

  registerSuccessfulLogin(username, password): void {
    sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username);
   
  }
  logout(): Observable<any>  {
    return this.http.get(ControllerURL.LOGOUT).pipe( map ((res) => {
      this.logoutSuccessFully();
    }));
  }
  logoutSuccessFully(): void {
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    sessionStorage.removeItem(this.TOKEN_SESSION_ATTRIBUTE_NAME);
    sessionStorage.removeItem(this.USER_OBJECT_SESSION_ATTRIBUTE);
    this.userObject = null;
    this.auth   = null;
  }

  isUserLoggedIn(): boolean {
    const user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    if (user === null) return false;
    return true;
  }



  isAdmin(): boolean{
    let admin = this.userObject.roles.filter(item => item == "ROLE_ADMIN");
    return admin.length > 0
  }
}