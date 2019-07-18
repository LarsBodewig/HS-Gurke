import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TwitterPost } from '../models/post-twitter';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public getTwitterData(): Promise<TwitterPost[]> {
    return this.http.get<TwitterPost[]>('/assets/data/twitter-posts.json').toPromise();
  }
}