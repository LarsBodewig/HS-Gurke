import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { RoutingService } from '../services/routing.service';
import { HeaderItem } from '../models/menu-header-item';
import { CustomItem } from '../models/menu-custom-item';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public headerItems: HeaderItem[];
  public customItems: CustomItem[];

  @ViewChild('interest') myDialog: any; show() {
    this.myDialog.nativeElement.showModal();
  }

  close() {
    this.myDialog.nativeElement.close();
  }

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
