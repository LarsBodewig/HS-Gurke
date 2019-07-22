import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutingService } from '../services/routing.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private routing: RoutingService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.routing.getRouteParams()['token'];
    // return http.post(url, token).then...
    // obviously remove :any from .then(response
    return new Promise(() => { return {}; }).then((response:any) => {
      if (response.status === 200) {
        return true;
      }
      return false;
    });
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
