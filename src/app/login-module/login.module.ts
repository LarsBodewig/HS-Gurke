import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login-component/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { PageComponent } from './page/page.component';
import { RegisterComponent } from './register-component/register.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    IonicModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    PageComponent
  ]
})
export class LoginModule { }
