import { Injectable } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, UrlTree } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  public url: string;

  constructor(
    private router: Router,
    private nav: NavController,
    private menu: MenuController
  ) { }

  register() {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.toggleLandingPage(true);
      } else if (event instanceof RouteConfigLoadEnd) {
        this.toggleLandingPage(false);
      }
      if (event instanceof NavigationEnd) {
        this.changeUrl(event.urlAfterRedirects);
        this.enableMenu(event.urlAfterRedirects);
      }
    });
  }

  toggleLandingPage(activated: boolean) {
    //
  }

  enableMenu(url: string) {
    if (url === '/login' || url === '/register') {
      this.menu.enable(false);
    } else {
      this.menu.enable(true);
    }
  }

  changeUrl(url: string) {
    this.url = url;
  }

  public navigate(direction: string, url: string | any[] | UrlTree, options?: NavigationOptions): Promise<String> {
    switch (direction.toLowerCase()) {
      case 'root': this.nav.navigateRoot(url, options); break;
      case 'forward': this.nav.navigateForward(url, options); break;
      case 'back': this.nav.navigateBack(url, options); break;
      default: return Promise.reject('Invalid navigation direction: ' + direction + '. Use "root", "forward" or "back".');
    }

    return new Promise((resolve, reject) => {
      this.router.events
        .pipe(take(1))
        .subscribe(event => {
          if (event instanceof NavigationEnd) {
            resolve(event.urlAfterRedirects);
          }
        });
    });
  }
}
