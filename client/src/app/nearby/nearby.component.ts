import { Component, OnInit } from '@angular/core';

// const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
//
// function switchTheme(e) {
//     if (e.target.checked) {
//         document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     else {
//         document.documentElement.setAttribute('data-theme', 'light');
//     }
// }
//
// toggleSwitch.addEventListener('change', switchTheme, false);

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss'],
})
export class NearbyComponent implements OnInit {

  constructor() { }

  // ngAfterViewInit() {
  //   switchTheme('#checkbox');
  // }

  ngOnInit() { }

}
