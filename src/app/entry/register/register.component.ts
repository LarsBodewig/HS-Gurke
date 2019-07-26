import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(
    private routing: RoutingService,
    private account: AccountService,
    private alert: AlertController,
    forms: FormBuilder
  ) {
    this.registerForm = forms.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordVerify: new FormControl('', Validators.required)
    });
  }

  ngOnInit() { }

  navigateLogin() {
    const loginRoute: string = '/login';
    this.routing.navigate('root', loginRoute);
  }

  private getFormData(): { email: string, password: string, passwordVerify: string } {
    const emailControlName: string = 'email';
    const passwordControlName: string = 'password';
    const passwordVerifyControlName: string = 'passwordVerify';
    const emailValue: string = this.registerForm.get(emailControlName).value;
    const passwordValue: string = this.registerForm.get(passwordControlName).value;
    const passwordVerifyValue: string = this.registerForm.get(passwordVerifyControlName).value;
    return { email: emailValue, password: passwordValue, passwordVerify: passwordVerifyValue };
  }

  onRegister() {
    const formData: { email: string, password: string, passwordVerify: string } = this.getFormData();
    const register: Promise<{ granted: boolean, reason?: string }> = this.account.register(formData);
    const result: Promise<void> = register.then(res => {
      if (res.granted) {
        this.showAlert(true, 'Registrierung erfolgreich, Verifizierungslink per Mail versendet.');
      } else {
        this.showAlert(false, res.reason);
      }
    }, rej => {
      console.log('This wasn\'t supposed to happen!');
      console.log(rej);
    });
  }

  private async showAlert(success: boolean, text: string): Promise<void> {
    const alert = await this.alert.create({
      header: (success ? 'Registrierung erfolgreich' : 'Registrieren nicht möglich'),
      message: text,
      backdropDismiss: false,
      buttons: ['OK'],
      cssClass: 'dialog ' + (success ? 'dialog-success' : 'dialog-error')
    });
    return alert.present();
  }
}
