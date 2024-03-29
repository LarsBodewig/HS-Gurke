import { Injectable } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, UrlTree, ActivatedRoute, Params } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  public url: string;
  private urlObserver: Subject<string>;

  constructor(
    private router: Router,
    private nav: NavController,
    private route: ActivatedRoute
  ) { }

  register() {
    this.urlObserver = new Subject();
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.toggleLandingPage(true);
      } else if (event instanceof RouteConfigLoadEnd) {
        this.toggleLandingPage(false);
      }
      if (event instanceof NavigationEnd) {
        const tree: UrlTree = this.router.parseUrl(event.urlAfterRedirects);
        this.changeUrl(tree.root.children['primary'].segments.join('/'));
      }
    });
  }

  toggleLandingPage(activated: boolean) {
    //
  }

  enableMenu(url: string) {
    if (url === 'login'
      || url === 'register'
      || url === 'recover'
      || url === 'terminate') {
      this.menu.enable(false);
    } else {
      this.menu.enable(true);
    }
  }

  changeUrl(url: string) {
    this.url = url;
    this.urlObserver.next(this.url);
  }

  public async goBack() {
    //oder location.back, falls pop zu weit geht
    //nav.canGoBack() trotz Doku nicht vorhanden
    return await this.nav.pop();
  }

  public async navigate(direction: string, url: string, options?: NavigationOptions): Promise<String> {
    let resolve: Promise<Boolean>;
    switch (direction.toLowerCase()) {
      case 'root': resolve = this.nav.navigateRoot([url], options); break;
      case 'forward': resolve = this.nav.navigateForward([url], options); break;
      case 'back': resolve = this.nav.navigateBack([url], options); break;
      default: return Promise.reject('Invalid navigation direction: ' + direction + '. Use "root", "forward" or "back".');
    }
    await resolve;
    return Promise.resolve(this.url);
  }

  public getRouteParams(): Params {
    return this.route.snapshot.params;
  }

  public onNavigationEnd(): Observable<string> {
    return this.urlObserver.asObservable();
  }
}
