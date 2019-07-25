import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CustomItem, HeaderItem } from '../models/menu-item';
import { AccountService } from '../services/account.service';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public headerItems: HeaderItem[];
  public customItems: CustomItem[];

  constructor(
    private menu: MenuController,
    private routing: RoutingService,
    private account: AccountService
  ) {
    this.headerItems = [
      new HeaderItem('Home', 'home'), 
      new HeaderItem('Explore', 'explore'), 
      new HeaderItem('In deiner Nähe', 'nearby')
    ];
    this.menuFolder = [
      new MenuFolder({
        title: 'redrobotgt', url: 'redrobotgt', items: [
          { title: 'Twitter', fragment: 'twitter', source: '' }
        ]
      })
    ]
  }

  ngOnInit() { }

  navigate(url: string) {
    this.routing.navigate('root', url);
    this.menu.close();
  }
}
