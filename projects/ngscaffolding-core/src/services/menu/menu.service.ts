import { RolesService } from '../rolesService/roles.service';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { LoggingService } from '../logging/logging.service';
import { CoreMenuItem, AppSettings } from '@ngscaffolding/models';
import { AppSettingsQuery } from '../appSettings';
import { UserAuthorisationBase } from '../userAuthorisation/UserAuthorisationBase';
import { MenuStore } from './menu.store';
import { MenuQuery } from './menu.query';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private className = 'core.MenuService';

  private menuItemsFromCode: Array<CoreMenuItem>;
  private routes: Array<Route> = [];

  private menuItems: CoreMenuItem[];

  private menuItem: CoreMenuItem;

  private apiHome: string;

  public menuSubject = new BehaviorSubject<Array<CoreMenuItem>>(this.menuItems);
  public routeSubject = new BehaviorSubject<Array<Route>>(this.routes);

  constructor(
    private http: HttpClient,
    private menuStore: MenuStore,
    private menuQuery: MenuQuery,
    private appSettingsQuery: AppSettingsQuery,
    private authService: UserAuthorisationBase,
    private log: LoggingService,
    public rolesService: RolesService
  ) {

    // subscribe to menuItems for flat List
    menuQuery.menuItemsList$.subscribe(menuItemsList => this.menuItems = menuItemsList);

    // Wait for settings, then load from server
    combineLatest(authService.authenticated$, appSettingsQuery.selectEntity(AppSettings.apiHome))
      .subscribe(([authenticated, apiHome]) => {
        if (authenticated && apiHome) {
          this.apiHome = apiHome.value;
          this.downloadMenuItems();
        } else {
          this.menuStore.remove();
        }
      });
  }

  public addMenuItemsFromCode(menuItems: CoreMenuItem[], roles: string[] = null) {
    this.log.info(`Adding MenuItems ${JSON.stringify(menuItems)}`, this.className);

    // Save for later use
    this.menuItemsFromCode = menuItems;
  }

  private addMenuItems(menuItems: CoreMenuItem[]) {
    menuItems.forEach(menuItem => {
      this.menuStore.createOrReplace(menuItem.name, menuItem);
    });

    // Add to flat reference List
    this.addMenuItemsToReferenceList(menuItems);

    // Save our flat list to State
    this.menuStore.updateRoot({ menuItems: this.menuItems });

  }

  // Iterative Call
  private addMenuItemsToReferenceList(menuItems: CoreMenuItem[]): void {
    menuItems.forEach(menuItem => {
      this.menuItems.push(menuItem);
      if (this.menuItem.items && isArray(this.menuItem.items)) {
        const arrMenu = this.menuItem.items as Array<CoreMenuItem>;
        arrMenu.forEach(menuLoop => this.addMenuItemsToReferenceList(menuLoop.items as CoreMenuItem[]));
      }
     });
  }

  public getMenuItemByName(name: string): CoreMenuItem {
    this.menuItem = null;

    if (this.menuItems && this.menuItems.length > 0) {
      this.findMenuItem(name, this.menuItems);
    }
    return this.menuItem;
  }

  public downloadMenuItems() {

    this.menuStore.setLoading(true);
    const newMenuItems: CoreMenuItem[] = [];

    // First Add Menu Items Added from Code
    if (this.menuItemsFromCode) {
      this.menuItemsFromCode.forEach(menuItemFromCode => {
        this.addNewMenuItem(newMenuItems, menuItemFromCode);
      });
    }

    this.http.get<Array<CoreMenuItem>>(this.apiHome + '/api/v1/menuitems').subscribe(menuItems => {
      menuItems.forEach(loopMenuItem => {
        this.addNewMenuItem(newMenuItems, loopMenuItem);
      });

      newMenuItems.forEach(newMenuItem => {
        this.menuStore.createOrReplace(newMenuItem.name, newMenuItem);
      });
      this.menuStore.setLoading(false);
    });
  }

  // public addMenuItem(menuItem: CoreMenuItem, route: Route = null, roles: string[] = null) {
  //   this.log.info(`Adding Menu ${JSON.stringify(menuItem)}`, this.className);
  //   this.menuItems.push(menuItem);
  //   this.menuSubject.next(this.menuItems);

  //   if (route !== null) {
  //     this.addRoute(route);
  //   }

  //   if (roles !== null) {
  //     this.rolesService.addRouteRoles(route.path, roles);
  //   }
  // }

  public addRoute(route: Route, roles: string[] = null) {
    this.log.info(`Adding Route ${JSON.stringify(route)}`, this.className);
    this.routes.push(route);
    this.routeSubject.next(this.routes);

    if (roles !== null) {
      this.rolesService.addRouteRoles(route.path, roles);
    }
  }

  private findMenuItem(name: string, menuItems: CoreMenuItem[]) {
    if (menuItems) {
      menuItems.forEach(menuItem => {
        this.findMenuItem(name, menuItem.items as CoreMenuItem[]);
        if (menuItem.name && menuItem.name.toLowerCase() === name.toLowerCase()) {
          this.menuItem = menuItem;
        }
      });
    }
  }

  private addNewMenuItem(targetMenu: CoreMenuItem[], newMenuItem: CoreMenuItem) {
    let calcRouterLink: string | string[];

    // Don't add if we already know about this
    if (targetMenu && !targetMenu.find(menu => menu.name === newMenuItem.name)) {
      if (newMenuItem.routerLink && (<string>newMenuItem.routerLink).indexOf(',') > -1) {
        calcRouterLink = (<string>newMenuItem.routerLink).split(',');
      } else {
        calcRouterLink = newMenuItem.routerLink;
      }

      const createdMenuItem: CoreMenuItem = {...newMenuItem, routerLink: calcRouterLink};

      targetMenu.push(createdMenuItem);

      if (newMenuItem.items && newMenuItem.items.length > 0) {
        createdMenuItem.items = [];
        const castItems = newMenuItem.items as CoreMenuItem[];
        castItems.forEach(menuItem => {
          this.addNewMenuItem(createdMenuItem.items as CoreMenuItem[], menuItem);
        });
      }
    }
  }
}
