import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy, PopoverController } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntryModule } from './entry/entry.module';
import { ExploreComponent } from './explore/explore.component';
import { HomeComponent } from './home/home.component';
import { NearbyComponent } from './nearby/nearby.component';
import { PopoverComponentComponent } from './popover-component/popover-component.component';
import { AccountService } from './services/account.service';
import { HttpService } from './services/http.service';
import { SettingsComponent } from './settings/settings.component';
import { ItemComponent } from './sidemenu/item/item.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { TopicComponent } from './topic/topic.component';
import { TwitterItemComponent } from './topic/item-twitter/item-twitter.component';
import { YoutubeItemComponent } from './topic/item-youtube/item-youtube.component';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    EntryModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpService,
    AccountService,
    PopoverController
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    SidemenuComponent,
    ItemComponent,
    ExploreComponent,
    NearbyComponent,
    TopicComponent,
    PopoverComponentComponent,
    SettingsComponent,
    TwitterItemComponent,
    YoutubeItemComponent
  ],
  entryComponents: [
    PopoverComponentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
