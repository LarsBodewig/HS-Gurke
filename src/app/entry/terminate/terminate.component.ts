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

  private getFormData(): { email: string, code: string } {
    const emailControlName: string = 'email';
    const codeControlName: string = 'code';
    const emailValue: string = this.terminateForm.get(emailControlName).value;
    const codeValue: string = this.terminateForm.get(codeControlName).value;
    return { email: emailValue, code: codeValue };
  }

  onTerminate() {
    const formData: { email: string, code: string } = this.getFormData();
    const terminate: Promise<{ granted: boolean, reason?: string }> = this.account.terminate(formData);
    const result: Promise<void> = terminate.then(res => {
      if (res.granted) {
        this.showAlert(true, 'Account wurde erfolgreich gelöscht.');
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
