import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Account } from '../models/account';
import { MenuFolder } from '../models/menu-folder';
import { MenuItem } from '../models/menu-item';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private account: Account;
  private redirect: string;
  private accountUpdate: Subject<void>;

  constructor() {
    this.accountUpdate = new Subject();
  }

  public login(data: { email: string, password: string }): Promise<{ granted: boolean, redirect?: string, reason?: string }> {
    this.account = {
      pages: [
        new MenuFolder({
          title: 'redrobotgt', url: 'redrobotgt', items: [
            { title: 'Twitter', fragment: 'twitter', source: '' }
          ]
        })
      ]
    };
    this.accountUpdate.next();
    return Promise.resolve({ granted: true, redirect: this.getRedirect() });
  }

  public register(data: { email: string, password: string, passwordVerify: string }): Promise<{ granted: boolean, reason?: string }> {

    return Promise.resolve({ granted: true });
  }

  public recover(data: { email: string, code: string, password: string, passwordVerify: string }): Promise<{ granted: boolean, reason?: string }> {

    return Promise.resolve({ granted: false, reason: 'Der eingegebene Sicherheitscode stimmt nicht mit dem hinterlegten überein.' });
  }

  public terminate(data: { email: string, code: string }): Promise<{ granted: boolean, reason?: string }> {

    return Promise.resolve({ granted: true });
  }

  public isLoggedIn(): boolean {
    return this.account != undefined;
  }

  public getPages(): Array<MenuFolder | MenuItem> {
    return this.account.pages;
  }

  public onUpdate(): Observable<void> {
    return this.accountUpdate;
  }

  setRedirect(url: string): void {
    this.redirect = url;
  }

  clearRedirect(): void {
    this.redirect = undefined;
  }

  getRedirect(): string {
    return this.redirect;
  }
}
