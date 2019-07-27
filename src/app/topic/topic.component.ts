import { Component, OnInit } from '@angular/core';
import { TwitterPost } from '../models/post-twitter';
import { AccountService } from '../services/account.service';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {

  public posts: TwitterPost[];

  constructor(private routing: RoutingService, private account: AccountService) { }

  ngOnInit() {
    this.routing.onNavigationEnd().subscribe(url => {
      this.account.getTweets(url)
        .then(posts => this.posts = posts);
    });
  }

  getDate(timestamp: number): String {
    const d: Date = new Date(timestamp);
    return d.toLocaleDateString() + ' @ ' + d.toLocaleTimeString();
  }
}
