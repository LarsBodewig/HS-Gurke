import { Component, Input, OnInit } from '@angular/core';
import { YoutubePost } from 'src/app/models/post-youtube';


@Component({
  selector: 'item-youtube',
  templateUrl: './item-youtube.component.html',
  styleUrls: ['./item-youtube.component.scss'],
})
export class YoutubeItemComponent implements OnInit {

  @Input() post: YoutubePost;

  constructor() { }

  ngOnInit() { }

  getDate(timestamp: number): String {
    const d: Date = new Date(timestamp);
    return d.toLocaleDateString() + ' @ ' + d.toLocaleTimeString();
  }
}

