import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private account: AccountService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token: { code: string } = { code: next.params['token'] };
    const verify: Promise<{ granted: boolean, reason?: string }> = this.account.verify(token);
    const result: Promise<boolean> = verify.then(res => {
      if (res.granted) {
        return true; //gets redirected to login, i think
      } else {
        return false; // gets redirected too but is not informed about the error
      }
    }, rej => {
      console.log('This wasn\'t supposed to happen!');
      console.log(rej);
      return false;
    });
    return result;
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
