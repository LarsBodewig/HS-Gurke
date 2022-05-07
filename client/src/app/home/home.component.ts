import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from '../models/post';
import { AccountService } from '../services/account.service';

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
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  unseen: Post[];

  constructor(private account: AccountService) { }

  ngAfterViewInit() {
    setTimeout(()=>resizeAllGridItems(),500);
  }

  ngOnInit() {
    this.account.onUpdate().subscribe(value => {
      if (value != null) {
        this.unseen = this.account.getUnseenPosts();
      }
    });
  }
}
