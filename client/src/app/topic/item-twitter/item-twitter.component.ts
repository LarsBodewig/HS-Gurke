import { Component, Input, OnInit } from '@angular/core';
import { TwitterPost } from 'src/app/models/post-twitter';

@Component({
  selector: 'item-twitter',
  templateUrl: './item-twitter.component.html',
  styleUrls: ['./item-twitter.component.scss'],
})
export class TwitterItemComponent implements OnInit {

  @Input() post: TwitterPost;

  constructor() { }

  ngOnInit() { }

  getDate(timestamp: number): String {
    const d: Date = new Date(timestamp);
    return d.toLocaleDateString() + ' @ ' + d.toLocaleTimeString();
  }
}
