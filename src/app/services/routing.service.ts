import { Injectable } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  public url: string;
  public fragment: string;

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
        this.changeFragment(event.urlAfterRedirects);
        this.enableMenu(event.urlAfterRedirects);
      }
    });
  }

  toggleLandingPage(activated: boolean) {
    //
  }

  enableMenu(url: string) {
    if (url === 'login' || url === 'register') {
      this.menu.enable(false);
    } else {
      this.menu.enable(true);
    }
  }

  changeFragment(url: string) {
    this.fragment = this.router.parseUrl(url).fragment;
  }

  changeUrl(url: string) {
    this.url = this.router.parseUrl(url).root.children['primary'].segments.join('/');
  }

  public navigate(direction: string, url: string, options?: NavigationOptions): Promise<String> {
    let resolve: Promise<Boolean>;
    switch (direction.toLowerCase()) {
      case 'root': resolve = this.nav.navigateRoot([url], options); break;
      case 'forward': resolve = this.nav.navigateForward([url], options); break;
      case 'back': resolve = this.nav.navigateBack([url], options); break;
      default: return Promise.reject('Invalid navigation direction: ' + direction + '. Use "root", "forward" or "back".');
    }
    return resolve.then(() => {
      return Promise.resolve(this.url);
    });
  }
}
