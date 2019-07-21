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

  private getFormData(): Promise<{ email: string, password: string }> {
    const emailControlName: string = 'email';
    const passwordControlName: string = 'password';

    const emailControl: AbstractControl = this.loginForm.get(emailControlName);
    const passwordControl: AbstractControl = this.loginForm.get(passwordControlName);
    if (!emailControl || !passwordControl) {
      return Promise.reject("FormControlName in LoginComponent was changed");
    }

    const emailValue: string = emailControl.value;
    const passwordValue: string = passwordControl.value;
    if (!emailValue || !passwordValue) {
      return Promise.reject("Form validation did not prevent login call");
    }

    return Promise.resolve({ email: emailValue, password: passwordValue });
  }

  async onLogin() {
    await this.getFormData()
      .then((formData: { email: string, password: string }): Promise<{ granted: boolean, redirect?: string, reason?: string }> => {
        return this.account.login(formData);
      })
      .then((resolve: { granted: boolean, redirect?: string, reason?: string }): Promise<void> => {
        if (!resolve.granted) {
          return Promise.reject(resolve.reason ? resolve.reason : 'E-Mail oder Password falsch.');
        }
        if(resolve.redirect){
          return Promise.resolve(this.navigateRedirect(resolve.redirect));
        }
        return Promise.resolve(this.navigateHome());
      })
      .catch((reason: any): Promise<void> => {
        return this.showAlert(reason);
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
