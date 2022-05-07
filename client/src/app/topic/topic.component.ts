import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { RoutingService } from '../services/routing.service';
import { Post } from '../models/post';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {

  public posts: Post[];

  constructor(private routing: RoutingService, private account: AccountService) { }

  ngOnInit() {
    this.routing.onNavigationEnd().subscribe(url =>
      this.account.getPosts(url)
        .then(posts => this.posts = posts)
    );
  }
}
