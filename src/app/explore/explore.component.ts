import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentComponent } from '../popover-component/popover-component.component';

function resizeGridItem(item){
  let grid:Element = document.getElementsByClassName("grid")[0];
  var rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  var rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  console.log(item.outerHTML);
  var rowSpan = Math.ceil((item.getElementsByClassName("post")[0].getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
    item.style.gridRowEnd = "span "+rowSpan;
}

function resizeAllGridItems() {
  var allItems = document.getElementsByClassName("post-card");
  for(var x=0;x<allItems.length;x++){
    resizeGridItem(allItems[x]);
  }
}

function resizeInstance(instance){
    var item = instance.elements[0];
  resizeGridItem(item);
}

//window.onload = resizeAllGridItems();
window.addEventListener("resize", resizeAllGridItems);

var allItems = document.getElementsByClassName("post-card");
for(var x=0;x<allItems.length;x++){
//  imagesLoaded( allItems[x], resizeInstance);
}


@Component({
  selector: 'explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})

export class ExploreComponent implements OnInit {

  constructor(public controller:PopoverController) {}

  ngAfterViewInit() {
    setTimeout(()=>resizeAllGridItems(),100);
  }
  ngOnInit () {

  }

  async handleButtonClick(ev) {
    // handleButtonClick(ev, this.controller);
    let popover = await this.controller.create({
      component: PopoverComponentComponent,
      event: ev,
      translucent: true,
      showBackdrop: false
    });
    return popover.present();
  }
}
