import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntryModule } from './entry/entry.module';
import { ExploreComponent } from './explore/explore.component';
import { HomeComponent } from './home/home.component';
import { NearbyComponent } from './nearby/nearby.component';
import { AccountService } from './services/account.service';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { TopicComponent } from './topic/topic.component';

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    EntryModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AccountService
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    SidemenuComponent,
    ExploreComponent,
    NearbyComponent,
    TopicComponent
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
