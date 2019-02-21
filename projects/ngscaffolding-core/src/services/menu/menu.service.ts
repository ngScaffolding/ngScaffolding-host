import { RolesService } from '../rolesService/roles.service';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { LoggingService } from '../logging/logging.service';
import { CoreMenuItem, AppSettings } from '@ngscaffolding/models';
import { AppSettingsQuery } from '../appSettings';
import { UserAuthenticationQuery } from '../userAuthentication';
import { MenuStore } from './menu.store';
import { MenuQuery } from './menu.query';
import { isArray } from 'util';
import { finalize } from 'rxjs/internal/operators/finalize';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private className = 'core.MenuService';

  private menuItemsFromCode: Array<CoreMenuItem> = [];
  private routes: Array<Route> = [];

  private menuItems: CoreMenuItem[] = [];

  private apiHome: string;

  public routeSubject = new BehaviorSubject<Array<Route>>(this.routes);

  private httpInFlight = false;

  constructor(
    private http: HttpClient,
    private menuStore: MenuStore,
    private menuQuery: MenuQuery,
    private appSettingsQuery: AppSettingsQuery,
    private authQuery: UserAuthenticationQuery,
    private log: LoggingService,
    public rolesService: RolesService
  ) {
    // Wait for settings, then load from server
    combineLatest(this.authQuery.authenticated$, this.appSettingsQuery.selectEntity(AppSettings.apiHome)).subscribe(([authenticated, apiHome]) => {
      if (authenticated && apiHome) {
        this.apiHome = apiHome.value;
        if (!this.httpInFlight) {
          this.downloadMenuItems();
        }
      } else if (!authenticated) {
        this.menuStore.remove();
      }
    });
  }

  public addMenuItemsFromCode(menuItems: CoreMenuItem[], roles: string[] = null) {
    this.log.info(`Adding MenuItems ${JSON.stringify(menuItems)}`, this.className);

    // Save for later use
    this.menuItemsFromCode = [...this.menuItemsFromCode, ...menuItems];
  }

  public delete(menuItem: CoreMenuItem): Observable<any> {
    return new Observable<any>(observer => {
      const obs = this.http.delete(`${this.apiHome}/api/v1/menuitems/${menuItem.name}`);
      obs.subscribe(
        () => {
          // Remove from our store
          this.menuStore.remove(menuItem.name);

          // Remove from Tree
          const existingMenus = JSON.parse(JSON.stringify(this.menuQuery.getSnapshot().menuItems));
          let parentMenu: CoreMenuItem;
          if (menuItem.parent) {
            parentMenu = existingMenus.find(menu => menu.name.toLowerCase() === menuItem.parent.toLowerCase());
          }

          const foundIndex = (parentMenu.items as CoreMenuItem[]).findIndex(childMenu => childMenu.name === menuItem.name);
          parentMenu.items.splice(foundIndex, 1);

          // Update tree and tell the world
          this.menuStore.updateRoot({ menuItems: existingMenus });
          observer.next();
          observer.complete();
        },
        err => {
          observer.error(err);
        }
      );
    });
  }

  public saveMenuItem(menuItem: CoreMenuItem) {
    this.http.post<CoreMenuItem>(this.apiHome + '/api/v1/menuitems', menuItem).subscribe(savedMenuItem => {
      // Is this existing?
      const existing = this.menuQuery.hasEntity(menuItem.name);
      if (existing) {
        this.menuStore.createOrReplace(menuItem.name, menuItem);
      } else {
        // Add to reference list of menus
        this.menuStore.add(savedMenuItem);
      }

      const existingMenus = JSON.parse(JSON.stringify(this.menuQuery.getSnapshot().menuItems));
      let parentMenu: CoreMenuItem;
      if (menuItem.parent) {
        parentMenu = existingMenus.find(menu => menu.name.toLowerCase() === savedMenuItem.parent.toLowerCase());
      }
      // Add to treeview for menu rendering
      if (!parentMenu.items || !Array.isArray(parentMenu.items)) {
        parentMenu.items = [];
      }
      if (existing) {
        const foundIndex = (parentMenu.items as CoreMenuItem[]).findIndex(childMenu => childMenu.name === menuItem.name);
        parentMenu.items[foundIndex] = menuItem;
      } else {
        (parentMenu.items as CoreMenuItem[]).push(savedMenuItem);
      }

      // Update tree and tell the world
      this.menuStore.updateRoot({ menuItems: existingMenus });
    });
  }

  // Iterative Call
  private addMenuItemsToReferenceList(menuItems: CoreMenuItem[]): void {
    menuItems.forEach(menuItem => {
      // Add to Entity Store
      this.menuStore.createOrReplace(menuItem.name, menuItem);
      if (menuItem.items && Array.isArray(menuItem.items)) {
        this.addMenuItemsToReferenceList(menuItem.items as Array<CoreMenuItem>);
      }
    });
  }

  public downloadMenuItems() {
    // Mark loading status
    this.menuStore.setLoading(true);
    this.httpInFlight = true;

    const newMenuItems: CoreMenuItem[] = [];

    // First Add Menu Items Added from Code
    if (this.menuItemsFromCode) {
      this.menuItemsFromCode.forEach(menuItemFromCode => {
        this.addNewMenuItemToEntities(newMenuItems, menuItemFromCode);
      });
    }

    this.http
      .get<Array<CoreMenuItem>>(this.apiHome + '/api/v1/menuitems')
      .pipe(
        timeout(20000),
        finalize(() => {
          this.menuStore.setLoading(false);
          this.httpInFlight = false;
        })
      )
      .subscribe(
        downloadedMenuItems => {

          this.log.info(`Downloaded MenuItems`, this.className);


          // Add to flat reference List
          this.addMenuItemsToReferenceList(this.menuItemsFromCode);

          this.menuItemsFromCode.forEach(loopMenuItem => {
            this.addNewMenuItemToEntities(newMenuItems, loopMenuItem);
          });

          // Add to flat reference List
          this.addMenuItemsToReferenceList(downloadedMenuItems);

          downloadedMenuItems.forEach(loopMenuItem => {
            this.addNewMenuItemToEntities(newMenuItems, loopMenuItem);
          });

          newMenuItems.forEach(newMenuItem => {
            this.menuItems.push(newMenuItem);
          });

          this.menuStore.updateRoot({ menuItems: this.menuItems });
        },
        err => {
          this.menuStore.setError('Failed to download Menu');
        }
      );
  }

  public addRoute(route: Route, roles: string[] = null) {
    this.log.info(`Adding Route ${JSON.stringify(route)}`, this.className);
    this.routes.push(route);
    this.routeSubject.next(this.routes);

    if (roles !== null) {
      this.rolesService.addRouteRoles(route.path, roles);
    }
  }

  private addNewMenuItemToEntities(targetMenu: CoreMenuItem[], newMenuItem: CoreMenuItem) {
    let calcRouterLink: string | string[];

    // Don't add if we already know about this
    if (targetMenu && !targetMenu.find(menu => menu.name === newMenuItem.name)) {

      // Router bits
      if (newMenuItem.routerLink && (<string>newMenuItem.routerLink).indexOf(',') > -1) {
        calcRouterLink = (<string>newMenuItem.routerLink).split(',');
      } else {
        calcRouterLink = newMenuItem.routerLink;
      }

      const createdMenuItem: CoreMenuItem = { ...newMenuItem, routerLink: calcRouterLink };

      targetMenu.push(createdMenuItem);


      if (newMenuItem.items && newMenuItem.items.length > 0) {
        createdMenuItem.items = [];
        const castItems = newMenuItem.items as CoreMenuItem[];
        castItems.forEach(menuItem => {
          this.addNewMenuItemToEntities(createdMenuItem.items as CoreMenuItem[], menuItem);
        });
      }
    }
  }
}
