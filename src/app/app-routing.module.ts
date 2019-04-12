import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuard } from './app.guard';
import { ExploreComponent } from './explore/explore.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TopicComponent } from './topic/topic.component';
import { NearbyComponent } from './nearby/nearby.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [AppGuard]
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent,
    canActivate: [AppGuard]
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
    canActivate: [AppGuard],
  },
  {
    path: 'explore',
    pathMatch: 'full',
    component: ExploreComponent,
    canActivate: [AppGuard],
  },
  {
    path: 'nearby',
    pathMatch: 'full',
    component: NearbyComponent,
    canActivate: [AppGuard],
  },
  {
    path: ':topic',
    component: TopicComponent
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
