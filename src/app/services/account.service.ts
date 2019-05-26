import { Injectable } from '@angular/core';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private account: Account;
  private redirect: string;

  constructor() { }

  public login(data: { email: string, password: string }): Promise<{ granted: boolean, redirect?: string, reason?: string }> {
    this.account = {};
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
