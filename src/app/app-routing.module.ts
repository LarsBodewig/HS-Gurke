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

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'recover',
    pathMatch: 'full',
    component: RecoverComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'terminate',
    pathMatch: 'full',
    component: TerminateComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'explore',
    pathMatch: 'full',
    component: ExploreComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'nearby',
    pathMatch: 'full',
    component: NearbyComponent,
    canActivate: [LoginGuard],
  },
  {
    path: ':topic',
    component: TopicComponent,
    canActivate: [LoginGuard, TopicGuard],
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
