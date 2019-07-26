import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Account } from '../models/account';
import { CustomItem } from '../models/menu-item';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private account: Account;
  private redirect: string;
  private accountUpdate: Subject<Account>;

  constructor(private http: HttpService) {
    this.accountUpdate = new Subject();
    this.accountUpdate.subscribe(update => this.account = update);
    /*this.account = {
      items: [
        new MenuFolder('Favorites', 'fav', [
          new MenuFolder('Twitter', 'twitter', [
            new MenuItem('redrobotgt', 'redrobotgt', '')
          ])
        ])
      ]
    };*/
  }

  public login(data: { email: string, password: string }): Promise<{ granted: boolean, redirect?: string, reason?: string }> {
    if (data.email.length <= 0) { // validierung?
      return Promise.resolve({ granted: false, reason: 'E-Mail-Adresse fehlt.' });
    }
    if (data.password.length <= 0) { // min length, numbers?
      return Promise.resolve({ granted: false, reason: 'Passwort fehlt.' });
    }
    const getLogin: Promise<HttpResponse<{ token: string }>> = this.http.get<{ token: string }>('/account/login', data).toPromise();
    const result: Promise<{ granted: boolean, redirect?: string, reason?: string }> =
      getLogin.then(res => {
        const setToken: Promise<HttpHeaders> = this.http.setToken(res.body);
        const getSync: Promise<{ granted: boolean, reason?: string, data?: Account }> = setToken.then(res => this.sync());
        const innerResult: Promise<{ granted: boolean, redirect?: string, reason?: string }> =
          getSync.then(res => {
            if (res.granted && res.data) {
              this.accountUpdate.next(res.data);
              return { granted: true, redirect: this.getRedirect() };
            } else {
              return { granted: false, reason: res.reason };
            }
          }, rej => {
            console.log('This wasn\'t supposed to happen!');
            console.log(rej);
            return { granted: false, reason: 'Ein unerwarteter Programmfehler ist aufgetreten.' };
          });
        return innerResult;
      }, rej => {
        switch (rej.status) {
          case 503: return { granted: false, reason: 'Ein internes Serverproblem ist aufgetreten, bitte versuche es später wieder.' };
          case 401: return { granted: false, reason: 'E-Mail-Adresse und Passwort stimmen nicht überein.' };
          case 500: return { granted: false, reason: 'Es konnte kein Authentifizierungs-Token ausgestellt werden.' };
          default: return { granted: false, reason: 'Server hat einen unerwarteten Status zurückgegeben.' };
        }
      });
    return result;
  }

  //pull changes from server
  public sync(): Promise<{ granted: boolean, reason?: string, data?: Account }> {
    const getUpdate: Promise<HttpResponse<Account>> = this.http.get<Account>('/account/update', HttpService.authToken()).toPromise();
    const result: Promise<{ granted: boolean, reason?: string, data?: Account }> = getUpdate.then(res => {
      this.accountUpdate.next(res.body);
      return { granted: true, data: this.account };
    }, rej => {
      switch (rej.status) {
        case 503: return { granted: false, reason: 'Ein internes Serverproblem ist aufgetreten, bitte versuche es später wieder.' };
        case 403: return { granted: false, reason: 'Authentifizierung erforderlich, bitte erneut anmelden.' };
        case 500: return { granted: false, reason: 'Account nicht gefunden, bitte erneut anmelden.' };
        default: return { granted: false, reason: 'Server hat einen unerwarteten Status zurückgegeben.' };
      }
    });
    return result;
  }

  //push changes to server
  public update(token: HttpHeaders): Promise<{ granted: boolean, reason?: string }> {
    const postUpdate: Promise<HttpResponse<null>> = this.http.post('/account/update', token, this.account).toPromise();
    const result: Promise<{ granted: boolean, reason?: string }> = postUpdate.then(res => {
      return { granted: true };
    }, rej => {
      switch (rej.status) {
        case 503: return { granted: false, reason: 'Ein internes Serverproblem ist aufgetreten, bitte versuche es später wieder.' };
        case 403: return { granted: false, reason: 'Authentifizierung erforderlich, bitte erneut anmelden.' };
        case 500: return { granted: false, reason: 'Synchronisierung schlug fehl, bitte erneut anmelden.' };
        default: return { granted: false, reason: 'Server hat einen unerwarteten Status zurückgegeben.' };
      }
    });
    return result;
  }

  public register(data: { email: string, password: string, passwordVerify: string }): Promise<{ granted: boolean, reason?: string }> {
    if (data.email.length <= 0) { // validierung?
      return Promise.resolve({ granted: false, reason: 'Geben Sie eine E-Mail-Adressen an' });
    }
    if (data.password.length <= 0) { // min length, numbers?
      return Promise.resolve({ granted: false, reason: 'Das Passwort muss mindestens ein Zeichen lang sein.' });
    }
    if (data.password !== data.passwordVerify) {
      return Promise.resolve({ granted: false, reason: 'Die eingegebenen Passwörter stimmen nicht überein' });
    }
    delete data.passwordVerify;
    const postRegister: Promise<HttpResponse<null>> = this.http.post('/account/register', data).toPromise();
    const result: Promise<{ granted: boolean, reason?: string }> = postRegister.then(res => {
      return { granted: true };
    }, rej => {
      switch (rej.status) {
        case 503: return { granted: false, reason: 'Ein internes Serverproblem ist aufgetreten, bitte versuche es später wieder.' };
        case 409: return { granted: false, reason: 'Die eingegebene E-Mail-Adresse ist bereits in Verwendung.' };
        case 400: return { granted: false, reason: 'E-Mail-Adresse oder Passwort erfüllen nicht alle Kriterien.' };
        case 500: return { granted: false, reason: 'Die Accounterstellung schlug fehl.' };
        default: return { granted: false, reason: 'Server hat einen unerwarteten Status zurückgegeben.' };
      }
    });
    return result;
  }

  public recover(data: { email: string, code: string, password: string, passwordVerify: string }): Promise<{ granted: boolean, reason?: string }> {
    if (data.email.length <= 0) { // validierung?
      return Promise.resolve({ granted: false, reason: 'Geben Sie eine E-Mail-Adressen an' });
    }
    if (data.code.length <= 0) { // min length, numbers?
      return Promise.resolve({ granted: false, reason: 'Geben Sie ihren Sicherheitscode an. Nur die letzte E-Mail ist gültig.' });
    }
    if (data.password.length <= 0) { // min length, numbers?
      return Promise.resolve({ granted: false, reason: 'Das Passwort muss mindestens ein Zeichen lang sein.' });
    }
    if (data.password !== data.passwordVerify) {
      return Promise.resolve({ granted: false, reason: 'Die eingegebenen Passwörter stimmen nicht überein' });
    }
    delete data.passwordVerify;
    const postRecover: Promise<HttpResponse<null>> = this.http.post('/account/recover', data).toPromise();
    const result: Promise<{ granted: boolean, reason?: string }> = postRecover.then(res => {
      return { granted: true };
    }, rej => {
      switch (rej.status) {
        case 503: return { granted: false, reason: 'Ein internes Serverproblem ist aufgetreten, bitte versuche es später wieder.' };
        case 409: return { granted: false, reason: 'Die eingegebene E-Mail-Adresse wurde nicht gefunden.' };
        case 400: return { granted: false, reason: 'Der Sicherheitscode stimmt nicht mit dem Account überein oder das Password erfüllt nicht alle Kriterien.' };
        case 500: return { granted: false, reason: 'Das Zurücksetzen des Accounts schlug fehl.' };
        default: return { granted: false, reason: 'Server hat einen unerwarteten Status zurückgegeben.' };
      }
    });
    return result;
  }

  public terminate(data: { email: string, code: string }): Promise<{ granted: boolean, reason?: string }> {
    const postTerminate: Promise<HttpResponse<null>> = this.http.post('/account/terminate', data).toPromise();
    const result: Promise<{ granted: boolean, reason?: string }> = postTerminate.then(res => {
      return { granted: true };
    }, rej => {
      switch (rej.status) {
        case 503: return { granted: false, reason: 'Ein internes Serverproblem ist aufgetreten, bitte versuche es später wieder.' };
        case 409: return { granted: false, reason: 'Die eingegebene E-Mail-Adresse wurde nicht gefunden.' };
        case 400: return { granted: false, reason: 'Der Sicherheitscode stimmt nicht mit dem Account überein. Nur der zuletzt ausgestellte Sicherheitscode ist gültig.' };
        case 500: return { granted: false, reason: 'Das Löschen des Accounts schlug fehl.' };
        default: return { granted: false, reason: 'Server hat einen unerwarteten Status zurückgegeben.' };
      }
    });
    return result;
  }

  public verify(data: { code: string }): Promise<{ granted: boolean, reason?: string }> {
    const postVerify: Promise<HttpResponse<null>> = this.http.post('/account/verify', data).toPromise();
    const result: Promise<{ granted: boolean, reason?: string }> = postVerify.then(res => {
      return { granted: true };
    }, rej => {
      switch (rej.status) {
        case 503: return { granted: false, reason: 'Ein internes Serverproblem ist aufgetreten, bitte versuche es später wieder.' };
        case 400: return { granted: false, reason: 'Der Verifizierung-Code stimmt mit keinem Account überein.' };
        case 500: return { granted: false, reason: 'Die Verifizierung des Accounts schlug fehl.' };
        default: return { granted: false, reason: 'Server hat einen unerwarteten Status zurückgegeben.' };
      }
    });
    return result;
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

  public onUpdate(): Observable<Account> {
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
