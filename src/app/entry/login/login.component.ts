import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private routing: RoutingService
  ) { }

  ngOnInit() { }

  navigateRegister() {
    this.routing.navigate('root', '/register');
  }

  navigateRecover() {
    this.routing.navigate('root', '/recover');
  }

  login() { }
}
