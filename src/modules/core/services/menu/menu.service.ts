import { RolesService } from '../rolesService/roles.service';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

import { LoggingService } from '../logging/logging.service';
import { CoreMenuItem } from '../../models/coreMenuItem.model';
import { MenuItem } from 'primeng/primeng';
import { AppSettingsService } from '../appSettings/appSettings.service';
import { UserAuthorisationService } from '../userAuthorisation/userAuthorisation.service';

@Injectable()
export class MenuService {
  private className = 'core.MenuService';

  private menuItems: Array<CoreMenuItem> = [];
  private routes: Array<Route> = [];

  public menuSubject = new BehaviorSubject<Array<CoreMenuItem>>(this.menuItems);
  public routeSubject = new BehaviorSubject<Array<Route>>(this.routes);

  constructor(
    private http: HttpClient,
    private appSettings: AppSettingsService,
    private authService: UserAuthorisationService,
    private log: LoggingService,
    public rolesService: RolesService
  ) {
    // Wait for settings, then load from server
    authService.authenticatedSubject.subscribe(authorised =>{
      if(authorised){
        this.downloadMenuItems();
      }else{
        this.menuItems = [];
        this.menuSubject.next(this.menuItems);
      }
    });
  }

  public addMenuItems(menuItems: CoreMenuItem[], roles: string[] = null) {
    this.log.info(
      `Adding MenuItems ${JSON.stringify(menuItems)}`,
      this.className
    );

    menuItems.forEach(menuItem => {
      this.menuItems.push(menuItem);
    });
    this.menuSubject.next(this.menuItems);
  }

  public downloadMenuItems() {
    this.http
      .get<Array<CoreMenuItem>>(this.appSettings.apiHome + '/api/menuitems')
      .subscribe(menuItems => {
        menuItems.forEach(loopMenuItem => {
          this.addDownloadedMenuItem(this.menuItems, loopMenuItem);
        });
        this.menuSubject.next(this.menuItems);
      });
  }

  public addMenuItem(menuItem: CoreMenuItem, route: Route = null, roles: string[] = null) {
    this.log.info(`Adding Menu ${JSON.stringify(menuItem)}`, this.className);
    this.menuItems.push(menuItem);
    this.menuSubject.next(this.menuItems);

    if (route !== null) {
      this.addRoute(route);
    }

    if (roles !== null) {
      this.rolesService.addRouteRoles(route.path, roles);
    }
  }

  public addRoute(route: Route, roles: string[] = null) {
    this.log.info(`Adding Route ${JSON.stringify(route)}`, this.className);
    this.routes.push(route);
    this.routeSubject.next(this.routes);

    if (roles !== null) {
      this.rolesService.addRouteRoles(route.path, roles);
    }
  }

  private addDownloadedMenuItem(targetMenu: CoreMenuItem[], newMenuItem: CoreMenuItem) {
    let calcRouterLink: string|string[];

    if (newMenuItem.routerLink && (<string>newMenuItem.routerLink).indexOf(',') > -1){
      calcRouterLink = (<string>newMenuItem.routerLink).split(',');
    }else {
      calcRouterLink = newMenuItem.routerLink;
    }

    const createdMenuItem: CoreMenuItem = {
      name: newMenuItem.name,
      label: newMenuItem.label,
      routerLink: calcRouterLink,
      jsonSerialized: newMenuItem.jsonSerialized
    };

    targetMenu.push(createdMenuItem);

    if (newMenuItem.items && newMenuItem.items.length > 0) {
      createdMenuItem.items = [];
      let castItems = newMenuItem.items as CoreMenuItem[];
      castItems.forEach(menuItem => {
        this.addDownloadedMenuItem(createdMenuItem.items as CoreMenuItem[], menuItem);
      });
    }
  }
}
