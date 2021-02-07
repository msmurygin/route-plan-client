import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './login/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private router: Router, private authenticationService: AuthService) { }

  // tslint:disable-next-line:max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticationService.isUserLoggedIn()) {
      console.log('User is logged in');
      return true;
    } else {
      console.log('User is NOT logged in');
      this.router.navigate([`/`]);
      return false;
    }
  }
}