import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'recover',
  templateUrl: './recover.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class RecoverComponent implements OnInit {

  constructor(
    private routing: RoutingService
  ) { }

  ngOnInit() { }

  navigateLogin() {
    this.routing.navigate('root', '/login');
  }

  navigateRegister() {
    this.routing.navigate('root', '/register');
  }

  recover() { }
}
