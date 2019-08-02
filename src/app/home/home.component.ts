import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from '../models/post';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  unseen: Post[];

  constructor(private account: AccountService) { }

  ngOnInit() { 
    this.account.onUpdate().subscribe(value => {
      if (value != null) {
        this.unseen = this.account.getUnseenPosts();
      }
    });
  }
}
