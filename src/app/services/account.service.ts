import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  public login(data: { email: string, password: string }): Promise<boolean> {

    return Promise.resolve(false);
  }

  public register(data: { email: string, password: string, passwordVerify: string }): Promise<{ granted: boolean, reason?: string }> {

    return Promise.resolve({ granted: true });
  }

  public recover(data: { email: string, code: string, password: string, passwordVerify: string }): Promise<{ granted: boolean, reason?: string }> {

    return Promise.resolve({ granted: false, reason: 'Der eingegebene Sicherheitscode stimmt nicht mit dem hinterlegten überein.' });
  }

  public terminate(): Promise<boolean> {

    return Promise.resolve(true);
  }
}
