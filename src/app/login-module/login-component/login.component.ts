import { Component, OnInit, Input } from '@angular/core';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Input() page: PageComponent;

  constructor() { }

  ngOnInit() { }

  switchComponent() { this.page.mode = false; }

  login() { }
}
