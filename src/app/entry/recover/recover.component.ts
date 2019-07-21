import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'recover',
  templateUrl: './recover.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class RecoverComponent implements OnInit {

  public recoverForm: FormGroup;

  constructor(
    private routing: RoutingService,
    private account: AccountService,
    private alert: AlertController,
    forms: FormBuilder
  ) {
    this.recoverForm = forms.group({
      email: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordVerify: new FormControl('', Validators.required)
    });
  }

  ngOnInit() { }

  navigateLogin() {
    const loginRoute: string = '/login';
    this.routing.navigate('root', loginRoute);
  }

  navigateRegister() {
    const registerRoute: string = '/register';
    this.routing.navigate('root', registerRoute);
  }

  private getFormData(): Promise<{ email: string, code: string, password: string, passwordVerify: string }> {
    const emailControlName: string = 'email';
    const codeControlName: string = 'code';
    const passwordControlName: string = 'password';
    const passwordVerifyControlName: string = 'passwordVerify';

    const emailControl: AbstractControl = this.recoverForm.get(emailControlName);
    const codeControl: AbstractControl = this.recoverForm.get(codeControlName);
    const passwordControl: AbstractControl = this.recoverForm.get(passwordControlName);
    const passwordVerifyControl: AbstractControl = this.recoverForm.get(passwordVerifyControlName);
    if (!emailControl || !codeControl || !passwordControl || !passwordVerifyControl) {
      return Promise.reject("FormControlName in RecoverComponent was changed");
    }

    const emailValue: string = emailControl.value;
    const codeValue: string = codeControl.value;
    const passwordValue: string = passwordControl.value;
    const passwordVerifyValue: string = passwordVerifyControl.value;
    if (!emailValue || !codeValue || !passwordValue || !passwordVerifyValue) {
      return Promise.reject("Form validation did not prevent recover call");
    }

    return Promise.resolve({ email: emailValue, code: codeValue, password: passwordValue, passwordVerify: passwordVerifyValue });
  }

  async onRecover() {
    await this.getFormData().then((formData: { email: string, code: string, password: string, passwordVerify: string }) => {
      return this.account.recover(formData);
    }).then((resolve: { granted: boolean, reason?: string }) => {
      if (!resolve.granted) {
        return Promise.reject(resolve.reason ? resolve.reason : 'Account konnte nicht zurückgesetzt werden');
      }
      // kein Promise benötigt, success direkt zurückgeben
      return Promise.resolve();
    }, (reason: any) => {
      console.log(reason);
      return Promise.reject('Leider ist ein Fehler beim Zurücksetzen aufgetreten.');
    }).then(() => {
      this.showAlert(true, 'Melde dich mit deinem neuen Passwort an.');
      //navigation nach dialog dismiss wäre besser
      this.navigateLogin();
    }, (reason: any) => {
      this.showAlert(false, reason);
    });
  }

  private async showAlert(success: boolean, text: string): Promise<void> {
    const alert = await this.alert.create({
      header: (success ? 'Passwort zurückgesetzt' : 'Zurücksetzen nicht möglich'),
      message: text,
      backdropDismiss: false,
      buttons: ['OK'],
      cssClass: 'dialog ' + (success ? 'dialog-success' : 'dialog-error')
    });
    return alert.present();
  }
}
