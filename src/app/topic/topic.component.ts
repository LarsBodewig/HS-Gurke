import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { TwitterPost } from '../models/post-twitter';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {

  public posts: TwitterPost[];

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.getTwitterData().then(data => this.posts = data);
  }

  getDate(timestamp: number): String {
    const d: Date = new Date(timestamp);
    return d.toLocaleDateString() + ' @ ' + d.toLocaleTimeString();
  }
}
