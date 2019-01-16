import { RolesService } from '../rolesService/roles.service';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { LoggingService } from '../logging/logging.service';
import { CoreMenuItem, AppSettings } from '@ngscaffolding/models';
import { AppSettingsQuery } from '../appSettings';
import { UserAuthorisationBase } from '../userAuthorisation/UserAuthorisationBase';
import { MenuStore } from './menu.store';
import { MenuQuery } from './menu.query';
import { isArray } from 'util';
import { finalize } from 'rxjs/internal/operators/finalize';
import { take } from 'rxjs/internal/operators/take';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private className = 'core.MenuService';

  private menuItemsFromCode: Array<CoreMenuItem>;
  private routes: Array<Route> = [];

  private menuItems: CoreMenuItem[] = [];

  private apiHome: string;

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
    // First Time load away
    this.menuStore.setLoading(false);

    // Wait for settings, then load from server
    combineLatest(this.authService.authenticated$, this.appSettingsQuery.selectEntity(AppSettings.apiHome)).subscribe(([authenticated, apiHome]) => {
      if (authenticated && apiHome) {
        this.apiHome = apiHome.value;
        this.menuQuery.selectLoading().pipe(take(1)).subscribe(loading => {
            if (!loading) {
              this.downloadMenuItems();
            }
          });
      } else if (!authenticated) {
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
    // menuItems.forEach(menuItem => {
    //   this.menuItems.push(menuItem);
    // });

    // Add to flat reference List
    this.addMenuItemsToReferenceList(menuItems);

    // Save our flat list to State
    this.menuStore.updateRoot({ menuItems: this.menuItems });
  }

  // Iterative Call
  private addMenuItemsToReferenceList(menuItems: CoreMenuItem[]): void {
    menuItems.forEach(menuItem => {
      // Add to Entity Store
      this.menuStore.createOrReplace(menuItem.name, menuItem);
      if (menuItem.items && isArray(menuItem.items)) {
        this.addMenuItemsToReferenceList(menuItem.items as Array<CoreMenuItem>);
      }
    });
  }

  public downloadMenuItems() {
    // Mark loading status
    this.menuStore.setLoading(true);

    const newMenuItems: CoreMenuItem[] = [];

    // First Add Menu Items Added from Code
    if (this.menuItemsFromCode) {
      this.menuItemsFromCode.forEach(menuItemFromCode => {
        this.addNewMenuItem(newMenuItems, menuItemFromCode);
      });
    }

    this.http
      .get<Array<CoreMenuItem>>(this.apiHome + '/api/v1/menuitems')
      .pipe(
        finalize(() => {
          this.menuStore.setLoading(false);
          this.addMenuItems(this.menuItems);
        })
      )
      .subscribe(menuItems => {
        menuItems.forEach(loopMenuItem => {
          this.addNewMenuItem(newMenuItems, loopMenuItem);
        });

        newMenuItems.forEach(newMenuItem => {
          this.menuItems.push(newMenuItem);
        });

        this.menuStore.updateRoot({ menuItems: this.menuItems });
      });
  }

  public addRoute(route: Route, roles: string[] = null) {
    this.log.info(`Adding Route ${JSON.stringify(route)}`, this.className);
    this.routes.push(route);
    this.routeSubject.next(this.routes);

    if (roles !== null) {
      this.rolesService.addRouteRoles(route.path, roles);
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

      const createdMenuItem: CoreMenuItem = { ...newMenuItem, routerLink: calcRouterLink };

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
