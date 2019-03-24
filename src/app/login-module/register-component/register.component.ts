import { Component, OnInit, Input } from '@angular/core';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  @Input() page: PageComponent;

  constructor() { }

  ngOnInit() { }

  register() { }

  switchComponent() { this.page.mode = true; }
}
