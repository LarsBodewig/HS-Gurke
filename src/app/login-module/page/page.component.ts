import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {

  public mode: boolean = false;

  constructor() { }

  ngOnInit() { }

}
