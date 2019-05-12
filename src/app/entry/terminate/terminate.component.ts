import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-terminate',
  templateUrl: './terminate.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class TerminateComponent implements OnInit {

  constructor(
    private routing: RoutingService,
    private account: AccountService
  ) { }

  ngOnInit() { }

  terminate() { }

  cancel() {
    this.routing.goBack();
  }
}
