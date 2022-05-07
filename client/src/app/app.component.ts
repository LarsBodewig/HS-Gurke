import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { RoutingService } from './services/routing.service';
import { SidemenuComponent } from './sidemenu/sidemenu.component';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public loadingRouteConfig: boolean;
  public menuComponent: SidemenuComponent;
  public static testData: boolean = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private routing: RoutingService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.routing.register();
    this.routing.onNavigationEnd().subscribe(url => {
      if (url === 'login' || url === 'register' || url === 'recover' || url === 'terminate') {
        this.menu.enable(false);
      } else {
        this.menu.enable(true);
      }
    })
  }
}
