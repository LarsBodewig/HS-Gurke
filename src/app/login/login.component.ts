import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private router: NavController
  ) { }

  ngOnInit() { }

  navigateRegister() {
    this.router.navigateRoot('/register');
  }
}
