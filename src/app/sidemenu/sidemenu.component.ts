import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MenuFolder } from '../models/menu-folder';
import { AccountService } from '../services/account.service';
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
    private routing: RoutingService,
    private account: AccountService
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
    this.account.onUpdate().subscribe(() => {
      this.menuFolder = <MenuFolder[]>this.account.getPages().filter(entry => {
        return entry instanceof MenuFolder;
      });
    });
  }

  ngOnInit() { }

  navigate(url: string, fragment?: string) {
    this.routing.navigate('root', url, { fragment: fragment });
    this.menu.close();
  }
}
