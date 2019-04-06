import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(
    private routing: RoutingService
  ) { }

  ngOnInit() { }

  navigateLogin() {
    this.routing.navigate('root', '/login');
  }
}
