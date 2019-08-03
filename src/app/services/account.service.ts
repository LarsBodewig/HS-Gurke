import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { Account } from '../models/account';
import { CustomItem } from '../models/menu-custom-item';
import { Folder } from '../models/menu-folder';
import { TwitterItem } from '../models/menu-item-twitter';
import { Post } from '../models/post';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private account: Account;
  private redirect: string;
  private accountUpdate: BehaviorSubject<Account>;

  constructor(private http: HttpService, private httpClient: HttpClient) {
    this.accountUpdate = new BehaviorSubject(null);
    this.accountUpdate.subscribe(update => this.account = update);
  }

  public login(data: { email: string, password: string }): Promise<{ granted: boolean, redirect?: string, reason?: string }> {
    if (data.email.length <= 0) { // validierung?
      return Promise.resolve({ granted: false, reason: 'E-Mail-Adresse fehlt.' });
    }
    if (data.password.length <= 0) { // min length, numbers?
      return Promise.resolve({ granted: false, reason: 'Passwort fehlt.' });
    }
    if (AppComponent.testData) {
      const get = this.httpClient.get<Account>('assets/data/account.json').toPromise()
      const res = get.then(data => {
        this.accountUpdate.next(data);
        return { granted: true, redirect: this.getRedirect() };
      });
      return res;
    } else {
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
    return this.account.items.children;
  }

  public getPages(): string[] {
    const pages: string[] = [];
    for (const item of this.account.items.children) {
      pages.push(...this.recursivePages(item, ''));
    }
    return pages;
  }

  private recursivePages(item: CustomItem, parentUrl: string): string[] {
    const pages: string[] = [parentUrl + '/' + item.url];
    if (item.type === 'folder') {
      for (const child of (<Folder>item).children) {
        pages.push(...this.recursivePages(child, parentUrl + '/' + item.url));
      }
    }
    return pages;
  }

  public getUnseenPosts(): Post[] {
    return this.account.unseen;
  }

  public getPosts(url: string): Promise<Post[]> {
    const sources: Array<[string, string]> = this.getSources(url);
    let tweets: Promise<Post[]>[] = [];
    for (const source of sources) {
      const get: Promise<HttpResponse<Post[]>> = this.http.get<Post[]>(source[0], HttpService.authToken()).toPromise();
      const result: Promise<Post[]> = get.then(res => {
        return res.body;
      }, rej => {
        console.log('Error getting ' + source + ':');
        console.log(rej);
        return [];
      });
      tweets.push(result);
    }
    return Promise.all(tweets).then(twoDim => {
      let result: Post[] = [];
      twoDim.forEach(oneDim => result.push(...oneDim));
      result.sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
      return result;
    });
  }

  public getSources(url: string): Array<[string, string]> {
    const sources: Array<[string, string]> = [];
    for (const item of this.account.items.children) {
      sources.push(...this.recursiveSources(item, '/' + url, ''));
    }
    return sources;
  }

  private recursiveSources(item: CustomItem, url: string, parentUrl: string): Array<[string, string]> {
    const sources: Array<[string, string]> = [];
    if (item.type === 'folder') {
      for (const child of (<Folder>item).children) {
        sources.push(...this.recursiveSources(child, url, parentUrl + '/' + item.url));
      }
    } else if ((parentUrl + '/' + item.url).startsWith(url)) { //item.type === 'twitter' || 'youtube'
      sources.push([(<TwitterItem>item).source, item.type]);
    }
    return sources;
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
