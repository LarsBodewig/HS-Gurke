import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public headerItems: { title: string, url: string }[];
  public customItems: {}; //TODO folder?

  constructor(
    private menu: MenuController,
    private routing: RoutingService

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

  navigateItem(url: string) {
    this.routing.navigate('root', url);
    this.menu.close();
  }
}
