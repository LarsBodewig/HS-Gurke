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

  private getFormData(): Promise<{ email: string, password: string, passwordVerify: string }> {
    const emailControlName: string = 'email';
    const passwordControlName: string = 'password';
    const passwordVerifyControlName: string = 'passwordVerify';

    const emailControl: AbstractControl = this.registerForm.get(emailControlName);
    const passwordControl: AbstractControl = this.registerForm.get(passwordControlName);
    const passwordVerifyControl: AbstractControl = this.registerForm.get(passwordVerifyControlName);
    if (!emailControl || !passwordControl || !passwordVerifyControl) {
      return Promise.reject("FormControlName in RegisterComponent was changed");
    }

    const emailValue: string = emailControl.value;
    const passwordValue: string = passwordControl.value;
    const passwordVerifyValue: string = passwordVerifyControl.value;
    if (!emailValue || !passwordValue || !passwordVerifyValue) {
      return Promise.reject("Form validation did not prevent register call");
    }

    return Promise.resolve({ email: emailValue, password: passwordValue, passwordVerify: passwordVerifyValue });
  }

  async onRegister() {
    this.getFormData().then((formData: { email: string, password: string, passwordVerify: string }) => {
      return this.account.register(formData);
    }).then((resolve: { granted: boolean, reason?: string }) => {
      if (!resolve.granted) {
        return Promise.reject(resolve.reason ? resolve.reason : 'Registrierung konnte nicht abgeschloßen werden.');
      }
      // kein Promise benötigt, success direkt zurückgeben
      return Promise.resolve();
    }, (reason: any) => {
      console.log(reason);
      return Promise.reject('Leider ist ein Fehler bei der Registrierung aufgetreten.');
    }).then(()=> {
      this.showAlert(true,'Melde dich mit deinem neuen Account an.');
      //navigation nach dialog dismiss wäre besser
      this.navigateLogin();
    },(reason: any) => {
      this.showAlert(false,reason);
    });
  }

  private async showAlert(success: boolean, text: string): Promise<void> {
    const alert = await this.alert.create({
      header: (success? 'Registrierung erfolgreich' : 'Registrieren nicht möglich'),
      message: text,
      backdropDismiss: false,
      buttons: ['OK'],
      cssClass: 'dialog ' + (success ? 'dialog-success': 'dialog-error')
    });
    return alert.present();
  }
}
