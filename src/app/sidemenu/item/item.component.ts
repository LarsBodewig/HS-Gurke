import { Component, OnInit, Input } from '@angular/core';
import { CustomItem } from 'src/app/models/menu-item';
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

  constructor() { }

  ngOnInit() {}

}
