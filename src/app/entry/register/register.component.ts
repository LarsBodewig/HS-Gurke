import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(
    private routing: RoutingService
  ) { }

  ngOnInit() { }

  navigateLogin() {
    this.routing.navigate('root', '/login');
  }

  register() { }
}
