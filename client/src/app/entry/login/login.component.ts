import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(
    private routing: RoutingService,
    private account: AccountService,
    private alert: AlertController,
    forms: FormBuilder
  ) {
    this.loginForm = forms.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit() { }

  navigateRegister() {
    const registerRoute: string = '/register';
    this.routing.navigate('root', registerRoute);
  }

  navigateRecover() {
    const recoverRoute: string = '/recover';
    this.routing.navigate('root', recoverRoute);
  }

  private navigateRedirect(url: string) {
    this.routing.navigate('forward', url);
    this.account.clearRedirect();
  }

  private navigateHome() {
    const homeRoute: string = '/home';
    this.routing.navigate('root', homeRoute);
  }

  private getFormData(): { email: string, password: string } {
    const emailControlName: string = 'email';
    const passwordControlName: string = 'password';
    const emailValue: string = this.loginForm.get(emailControlName).value;
    const passwordValue: string = this.loginForm.get(passwordControlName).value;
    return { email: emailValue, password: passwordValue };
  }

  onLogin() {
    const formData: { email: string, password: string } = this.getFormData();
    const login: Promise<{ granted: boolean, redirect?: string, reason?: string }> = this.account.login(formData);
    const result: Promise<void> = login.then(res => {
      if (res.granted) {
        if (res.redirect) {
          this.navigateRedirect(res.redirect);
        } else {
          this.navigateHome();
        }
      } else {
        this.showAlert(res.reason);
      }
    }, rej => {
      console.log('This wasn\'t supposed to happen!');
      console.log(rej);
    });
  }

  private async showAlert(text: string): Promise<void> {
    const alert = await this.alert.create({
      header: 'Login nicht möglich',
      message: text,
      backdropDismiss: false,
      buttons: ['OK'],
      cssClass: 'dialog dialog-error'
    });
    return alert.present();
  }
}
