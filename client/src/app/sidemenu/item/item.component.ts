import { Component, Input, OnInit } from '@angular/core';
import { CustomItem } from 'src/app/models/menu-custom-item';
import { RoutingService } from 'src/app/services/routing.service';
import { SidemenuComponent } from '../sidemenu.component';

@Component({
  selector: 'custom-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: CustomItem;
  @Input() sidemenu: SidemenuComponent;
  @Input() parentUrl: string;
  public isActive: boolean;

  constructor(private routing: RoutingService) { }

  ngOnInit() {
    this.isActive = '/' + this.routing.url === this.getUrl();
    this.routing.onNavigationEnd().subscribe(url => this.isActive = '/' + url === this.getUrl());
  }

  public isFolder(item: CustomItem): boolean {
    return item.type === 'folder';
  }

  public getUrl(): string {
    return this.parentUrl + '/' + this.item.url;
  }
}
