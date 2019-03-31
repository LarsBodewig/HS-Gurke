import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: NavController
  ) { }

  ngOnInit() { }

  navigateLogin() {
    this.router.navigateRoot('/login');
  }
}
