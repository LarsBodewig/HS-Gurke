import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private static readonly PROTOCOL: string = 'http';
  private static readonly HOST: string = '172.20.152.249';
  private static readonly PORT: number = 8080;
  private static readonly PATH: string = 'api';

  private static loginToken: string;

  constructor(private http: HttpClient) { }

  private static baseUrl(): string {
    return HttpService.PROTOCOL + '://' + HttpService.HOST + ':' + HttpService.PORT + '/' + HttpService.PATH;
  }

  public setToken(body: { token: string }): Promise<HttpHeaders> {
    HttpService.loginToken = body.token;
    return Promise.resolve(HttpService.authToken());
  }

  public get<T>(url: string, headers: HttpHeaders | { email?: string, password: string }): Observable<HttpResponse<T>> {
    const observe = 'response';
    return this.http.get<T>(HttpService.baseUrl() + url, { headers, observe });
  }

  public post(url: string, headers: HttpHeaders | { email?: string, password?: string, code?: string }, body?: any): Observable<HttpResponse<null>> {
    const observe = 'response';
    return this.http.post<null>(HttpService.baseUrl() + url, body, { headers, observe });
  }

  public static authToken(): HttpHeaders {
    return new HttpHeaders({ 'auth_token': this.loginToken });
  }

  public once<T>(observable: Observable<T>): Observable<T> {
    return observable.pipe(first());
  }
}