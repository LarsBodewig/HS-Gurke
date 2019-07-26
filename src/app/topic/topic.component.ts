import { Component, OnInit } from '@angular/core';
import { TwitterPost } from '../models/post-twitter';
import { HttpService } from '../services/http.service';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {

  public posts: TwitterPost[];

  constructor(private http: HttpService, private routing: RoutingService) { }

  ngOnInit() {
    this.routing.onNavigationEnd().subscribe(url => {
      console.log(this.routing.url);
      //this.data.getTwitterData().then(data => this.posts = data);
    });
  }

  getDate(timestamp: number): String {
    const d: Date = new Date(timestamp);
    return d.toLocaleDateString() + ' @ ' + d.toLocaleTimeString();
  }
}
