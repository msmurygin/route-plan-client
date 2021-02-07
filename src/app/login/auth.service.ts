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
  // BASE_PATH: 'http://localhost:8080'
  USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser';

  public username: string;
  public password: string;
  public userObject : IUserContext ;


  constructor(private http: HttpClient) { }

  authenticationService(username: string, password: string): Observable<any> {
    return this.http.get(ControllerURL.LOGIN,
      { headers: { authorization: this.createBasicAuthToken(username, password) } }).pipe( map ((res) => {
      this.username = username;
      this.password = password;
      this.registerSuccessfulLogin(username, password);
      this.userObject = {
        userName : res['userName'],
        fullyQualifiedName : res['fullyQualifiedName'],
        roles : res['roles']
      } 
    }));
  }

  createBasicAuthToken(username: string, password: string): string  {
    return 'Basic ' + window.btoa(username + ':' + password);
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
    this.username = null;
    this.password = null;
  }

  isUserLoggedIn(): boolean {
    const user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    if (user === null) return false;
    return true;
  }

  getLoggedInUserName(): any {
    const user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    if (user === null) { return ''; }
    return user;
  }

  isAdmin(): boolean{
    let admin = this.userObject.roles.filter(item => item == "ROLE_ADMIN");
    return admin.length > 0
  }
}