import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MenuFolder } from '../models/menu-folder';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public headerItems: {
    title: string,
    url: string
  }[];
  public menuFolder: Array<MenuFolder>;

  constructor(
    private menu: MenuController,
    private routing: RoutingService
  ) {
    this.headerItems = [
      {
        title: 'Home',
        url: 'home'
      },
      {
        title: 'Explore',
        url: 'explore'
      },
      {
        title: 'In deiner Nähe',
        url: 'nearby'
      }
    ];
    this.menuFolder = [
      new MenuFolder({
        title: 'First', url: 'first', items: [
          { title: 'Facebook', fragment: 'facebook', source: '' }
        ]
      }),
      new MenuFolder({
        title: 'Second', url: 'second', items: [
          { title: 'Facebook', fragment: 'facebook', source: '' },
          { title: 'Twitter', fragment: 'twitter', source: '' },
          { title: 'Insta', fragment: 'instagram', source: '' }
        ]
      }),
      new MenuFolder({
        title: 'Third', url: 'third', items: [
          { title: 'Youtube', fragment: 'youtube', source: '' }
        ]
      })
    ]
  }

  ngOnInit() { }

  navigate(url: string, fragment?: string) {
    this.routing.navigate('root', url, { fragment: fragment });
    this.menu.close();
  }
}
