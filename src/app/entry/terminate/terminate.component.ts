import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-terminate',
  templateUrl: './terminate.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class TerminateComponent implements OnInit {

  constructor(
    private routing: RoutingService
  ) { }

  ngOnInit() { }

  terminate() { }

  cancel() {
    this.routing.goBack();
  }
}
