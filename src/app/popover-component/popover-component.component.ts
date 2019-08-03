import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'popover-component',
  templateUrl: './popover-component.component.html',
  styleUrls: ['./popover-component.component.scss'],
})
export class PopoverComponentComponent implements OnInit {

  close() {
    this.controller.dismiss();
  }

  constructor(public controller:PopoverController) {

  }

  ngOnInit() {}

}
