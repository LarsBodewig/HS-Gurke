import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuard } from './app.guard';

const routes: Routes = [
  /*{
    path: '',
    redirectTo: '', //cycle, guard
    pathMatch: 'full',
    // canActivate: [AppGuard]
  },*/
  {
    path: 'login',
    loadChildren: './login-module/login.module#LoginModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
