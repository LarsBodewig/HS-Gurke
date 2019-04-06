import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private routing: RoutingService
  ) { }

  ngOnInit() { }

  navigateRegister() {
    this.routing.navigate('root', '/register');
  }
}
