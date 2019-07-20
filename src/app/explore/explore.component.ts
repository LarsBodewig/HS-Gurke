import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngAfterViewInit() {
    setTimeout(()=>resizeAllGridItems(),100);
  }
  ngOnInit () {

  }
}
