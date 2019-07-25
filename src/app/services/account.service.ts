import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Account } from '../models/account';
import { MenuFolder } from '../models/menu-folder';
import { CustomItem, MenuItem } from '../models/menu-item';

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
        new MenuFolder({ title: 'testTopic', url: '/test', items: [] })
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

  public getItems(): CustomItem[] {
    return this.account.items;
  }

  public getPages(): string[] {
    let pages: string[] = [];
    for (const item of this.account.items) {
      pages = pages.concat(item.getPages().map(page => '/' + page));
    }
    return pages;
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
