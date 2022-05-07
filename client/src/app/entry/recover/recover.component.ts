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

  private getFormData(): { email: string, code: string, password: string, passwordVerify: string } {
    const emailControlName: string = 'email';
    const codeControlName: string = 'code';
    const passwordControlName: string = 'password';
    const passwordVerifyControlName: string = 'passwordVerify';
    const emailValue: string = this.recoverForm.get(emailControlName).value;
    const codeValue: string = this.recoverForm.get(codeControlName).value;
    const passwordValue: string = this.recoverForm.get(passwordControlName).value;
    const passwordVerifyValue: string = this.recoverForm.get(passwordVerifyControlName).value;
    return { email: emailValue, code: codeValue, password: passwordValue, passwordVerify: passwordVerifyValue };
  }

  onRecover() {
    const formData: { email: string, code: string, password: string, passwordVerify: string } = this.getFormData();
    const recover: Promise<{ granted: boolean, reason?: string }> = this.account.recover(formData);
    const result: Promise<void> = recover.then(res => {
      if (res.granted) {
        this.showAlert(true, 'Melde dich mit deinem neuen Passwort an.');
        this.navigateLogin();
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
      header: (success ? 'Passwort zurückgesetzt' : 'Zurücksetzen nicht möglich'),
      message: text,
      backdropDismiss: false,
      buttons: ['OK'],
      cssClass: 'dialog ' + (success ? 'dialog-success' : 'dialog-error')
    });
    return alert.present();
  }
}
