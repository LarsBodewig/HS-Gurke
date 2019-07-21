import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { RoutingService } from 'src/app/services/routing.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-terminate',
  templateUrl: './terminate.component.html',
  styleUrls: ['../entry.module.scss'],
})
export class TerminateComponent implements OnInit {

  public terminateForm: FormGroup;

  constructor(
    private routing: RoutingService,
    private account: AccountService,
    private alert: AlertController,
    forms: FormBuilder
  ) {
    this.terminateForm = forms.group({
      email: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required)
    });
  }

  ngOnInit() { }

  private navigateRegister() {
    const registerRoute: string = '/register';
    this.routing.navigate('root', registerRoute);
  }

  private getFormData(): Promise<{ email: string, code: string }> {
    const emailControlName: string = 'email';
    const codeControlName: string = 'code';

    const emailControl: AbstractControl = this.terminateForm.get(emailControlName);
    const codeControl: AbstractControl = this.terminateForm.get(codeControlName);
    if (!emailControl || !codeControl) {
      return Promise.reject("FormControlName in TerminateComponent was changed");
    }

    const emailValue: string = emailControl.value;
    const codeValue: string = codeControl.value;
    if (!emailValue || !codeValue) {
      return Promise.reject("Form validation did not prevent terminate call");
    }

    return Promise.resolve({ email: emailValue, code: codeValue });
  }

  onTerminate() { 
    this.getFormData().then((formData: { email: string, code: string}) => {
      return this.account.terminate(formData);
    }).then((resolve: { granted: boolean, reason?: string }) => {
      if (!resolve.granted) {
        return Promise.reject(resolve.reason ? resolve.reason : 'Account konnte nicht gelöscht werden');
      }
      // kein Promise benötigt, success direkt zurückgeben
      return Promise.resolve();
    }, (reason: any) => {
      console.log(reason);
      return Promise.reject('Leider ist ein Fehler beim Löschen aufgetreten.');
    }).then(() => {
      this.showAlert(true, 'Account wurde erfolgreich gelöscht.');
      //navigation nach dialog dismiss wäre besser
      this.navigateRegister();
    }, (reason: any) => {
      this.showAlert(false, reason);
    });
  }

  private async showAlert(success: boolean, text: string): Promise<void> {
    const alert = await this.alert.create({
      header: (success ? 'Account gelöscht' : 'Löschen nicht möglich'),
      message: text,
      backdropDismiss: false,
      buttons: ['OK'],
      cssClass: 'dialog ' + (success ? 'dialog-success' : 'dialog-error')
    });
    return alert.present();
  }

  onCancel() {
    this.routing.goBack();
  }
}
