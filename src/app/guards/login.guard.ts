import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { RoutingService } from '../services/routing.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private routing: RoutingService,
    private account: AccountService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const homeRoute: string = '/home';
    const loginRoute: string = '/login';
    const registerRoute: string = '/register';
    const recoverRoute: string = '/recover';

    const url = state.url;
    const loggedIn = this.account.isLoggedIn();

    if ((url === loginRoute || url === registerRoute || url === recoverRoute) && loggedIn) {
      this.routing.navigate('root', homeRoute);
      return false;
    } else if (url !== loginRoute && url !== registerRoute && url !== recoverRoute && !loggedIn) {
      this.account.setRedirect(url);
      this.routing.navigate('root', loginRoute);
      return false;
    } else {
      return true;
    }
  }

  //delete if unnecessary and remove interface
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  //delete if unnecessary and remove interface
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
