import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './entry/login/login.component';
import { RecoverComponent } from './entry/recover/recover.component';
import { RegisterComponent } from './entry/register/register.component';
import { TerminateComponent } from './entry/terminate/terminate.component';
import { ExploreComponent } from './explore/explore.component';
import { LoginGuard } from './guards/login.guard';
import { HomeComponent } from './home/home.component';
import { NearbyComponent } from './nearby/nearby.component';
import { TopicComponent } from './topic/topic.component';
import { TopicGuard } from './guards/topic.guard';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoginGuard],
    children: [
      {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent
      },
      {
        path: 'register',
        pathMatch: 'full',
        component: RegisterComponent
      },
      {
        path: 'recover',
        pathMatch: 'full',
        component: RecoverComponent
      },
      {
        path: 'terminate',
        pathMatch: 'full',
        component: TerminateComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        pathMatch: 'full',
        component: HomeComponent
      },
      {
        path: 'explore',
        pathMatch: 'full',
        component: ExploreComponent
      },
      {
        path: 'nearby',
        pathMatch: 'full',
        component: NearbyComponent
      },
      {
        path: 'settings',
        pathMatch: 'full',
        component: SettingsComponent
      },
      {
        path: ':topic',
        component: TopicComponent,
        canActivate: [TopicGuard],
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
