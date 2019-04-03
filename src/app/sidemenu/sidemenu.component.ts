import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public headerItems: { title: string, url: string }[];
  public customItems: {}; //TODO folder?

  constructor(
    private router: NavController
  ) {
    this.headerItems = [
      {
        title: 'Home',
        url: '/home'
      },
      {
        title: 'Explore',
        url: '/explore'
      },
      {
        title: 'In deiner Nähe',
        url: '/nearby'
      }];
  }

  ngOnInit() { }

}
