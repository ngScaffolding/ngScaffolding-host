import { RolesService } from '../rolesService/roles.service';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { timeout, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { LoggingService } from '../logging/logging.service';
import { CoreMenuItem, AppSettings, MenuTypes } from 'ngscaffolding-models';
import { AppSettingsQuery } from '../appSettings';
import { UserAuthenticationQuery } from '../userAuthentication';
import { MenuStore } from './menu.store';
import { MenuQuery } from './menu.query';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly methodName = 'MenuService';
    private masterListMenu: Array<CoreMenuItem> = [];
    private routes: Array<Route> = [];

    private menuItems: CoreMenuItem[] = [];

    private apiHome: string;

    public routeSubject = new BehaviorSubject<Array<Route>>(this.routes);

    private httpInFlight = false;
    private lockCount = 0;
    private menuDownloaded = false;

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
        combineLatest([
            this.authQuery.authenticated$,
            this.appSettingsQuery.selectEntity(AppSettings.apiHome),
            this.appSettingsQuery.selectEntity(AppSettings.isMobile)
        ]).subscribe(([authenticated, apiHome, isMobile]) => {
            if (authenticated && apiHome && isMobile && !this.menuDownloaded) {
                this.apiHome = apiHome.value;
                if (!this.httpInFlight) {
                    this.downloadMenuItems(isMobile.value || false);
                }
            }
        });
    }

    private addLock() {
        this.lockCount++;
        this.log.info(`MENU Service: Locks on Loading`, this.methodName, this.lockCount);
        this.menuStore.setLoading(true);
    }

    private removeLock() {
        this.lockCount--;
        this.log.info(`MENU Service: Locks on Loading`, this.methodName, this.lockCount);

        if (this.lockCount === 0) {
            this.menuStore.setLoading(false);
        }
    }

    public addMenuItemsFromCode(menuItems: CoreMenuItem[], roles: string[] = null) {
        this.addLock();
        this.log.info('Adding MenuItems menuItems', this.methodName, menuItems);

        // Wait till user authorised
        this.authQuery.authenticated$.subscribe(authorised => {
            if (authorised) {
                // Save for later use
                this.addMenuItems(menuItems);
                this.removeLock();
            }
        });
    }

    public getFolders(): CoreMenuItem[] {
        return this.menuQuery.getAll({
            filterBy: [entity => entity.type === MenuTypes.Folder]
        });
    }

    public delete(menuItem: CoreMenuItem): Observable<any> {
        return new Observable<any>(observer => {
            const obs = this.http.delete(`${this.apiHome}/api/v1/menuitems/${menuItem.name}`);
            obs.subscribe(
                () => {
                    // Remove from our store
                    this.menuStore.remove(menuItem.name);

                    // Remove from Tree
                    const existingMenus = JSON.parse(JSON.stringify(this.menuQuery.getAll()));
                    let parentMenu: CoreMenuItem;
                    if (menuItem.parent) {
                        parentMenu = existingMenus.find(
                            menu => menu.name && menu.name.toLowerCase() === menuItem.parent.toLowerCase()
                        );
                    }

                    const foundIndex = (parentMenu.items as CoreMenuItem[]).findIndex(
                        childMenu => childMenu.name && childMenu.name === menuItem.name
                    );
                    parentMenu.items.splice(foundIndex, 1);

                    // Update tree and tell the world
                    this.menuStore.update({ menuItems: existingMenus });
                    observer.next();
                    observer.complete();
                },
                err => {
                    observer.error(err);
                }
            );
        });
    }

    public saveMenuItem(menuItem: CoreMenuItem, updateMenuTree: boolean = true) {
        this.http.post<CoreMenuItem>(this.apiHome + '/api/v1/menuitems', menuItem).subscribe(savedMenuItem => {
            if (updateMenuTree) {
                this.updateExistingMenuItem(savedMenuItem);
            }
        });
    }

    public updateExistingMenuItem(menuItem: CoreMenuItem) {
        // Is this existing?
        const existing = this.menuQuery.hasEntity(menuItem.name);
        if (existing) {
            this.menuStore.upsert(menuItem.name, menuItem);
        } else {
            // Add to reference list of menus
            this.menuStore.add(menuItem);
        }

        const existingMenus = JSON.parse(JSON.stringify(this.menuQuery.getAll()));
        let parentMenu: CoreMenuItem;
        if (menuItem.parent) {
            parentMenu = existingMenus.find(menu => menu.name.toLowerCase() === menuItem.parent.toLowerCase());
        }
        // Add to treeview for menu rendering
        if (!parentMenu.items || !Array.isArray(parentMenu.items)) {
            parentMenu.items = [];
        }
        if (existing) {
            const foundIndex = (parentMenu.items as CoreMenuItem[]).findIndex(
                childMenu => childMenu.name === menuItem.name
            );
            parentMenu.items[foundIndex] = menuItem;
        } else {
            (parentMenu.items as CoreMenuItem[]).push(menuItem);
        }

        // Update tree and tell the world
        this.menuStore.update({ menuItems: existingMenus });
    }

    // Iterative Call
    private addMenuItemsToReferenceList(menuItems: CoreMenuItem[]): void {
        menuItems.forEach(menuItem => {
            // Add to Entity Store
            this.menuStore.upsert(menuItem.name, menuItem);
            if (menuItem.items && Array.isArray(menuItem.items)) {
                this.addMenuItemsToReferenceList(menuItem.items as Array<CoreMenuItem>);
            }
        });
    }

    private removeUnauthorisedMenuItems(menuItems: CoreMenuItem[]): CoreMenuItem[] {
        const user = this.authQuery.getValue();
        let userRoles: string[] = [];
        if (user && user.userDetails) {
            userRoles = user.userDetails.roles;
        }

        const removingMenus: string[] = [];
        let returnMenus: CoreMenuItem[] = JSON.parse(JSON.stringify(menuItems));

        for (let menuIndex = 0; menuIndex < returnMenus.length; menuIndex++) {
            const menuItem = returnMenus[menuIndex];

            let removingThis = false;

            // makes sure roles is array
            let checkingRoles = [];

            if (!menuItem.roles) {
                checkingRoles = [];
            } else if (Array.isArray(menuItem.roles)) {
                checkingRoles = [...menuItem.roles];
            } else {
                checkingRoles = [menuItem.roles];
            }

            // Is this role protected
            if (checkingRoles && checkingRoles.length > 0) {
                if (
                    userRoles &&
                    checkingRoles.filter(allowedRole => userRoles.indexOf(allowedRole) !== -1).length === 0
                ) {
                    // No Authority. Remove
                    removingThis = true;
                    removingMenus.push(menuItem.name);
                }
            }

            if (!removingThis && menuItem.items) {
                menuItem.items = this.removeUnauthorisedMenuItems(menuItem.items as CoreMenuItem[]);
            }
        }

        if (removingMenus.length > 0) {
            returnMenus = menuItems.filter(menu => removingMenus.findIndex(remove => remove === menu.name) === -1);
        }

        return returnMenus;
    }

    public downloadMenuItems(isMobile: boolean) {
        // Mark loading status
        this.addLock();
        this.httpInFlight = true;

        const newMenuItems: CoreMenuItem[] = [];

        this.http
            .get<Array<CoreMenuItem>>(`${this.apiHome}/api/v1/menuitems?mobile=${isMobile}`)
            .pipe(
                timeout(20000),
                finalize(() => {
                    this.httpInFlight = false;
                    this.removeLock();
                })
            )
            .subscribe(
                downloadedMenuItems => {
                    this.log.info(`Downloaded MenuItems`);
                    this.menuDownloaded = true;

                    this.addMenuItems(downloadedMenuItems);
                },
                err => {
                    this.log.error('Failed to download Menu');
                }
            );
    }

    public addMenuItems(newMenuItems: CoreMenuItem[]) {
        // Save to Master List
        for (const newMenu of newMenuItems) {
            if (this.masterListMenu.findIndex(masterMenu => masterMenu.name === newMenu.name) === -1) {
                this.masterListMenu.push(newMenu);
            }
        }

        // Clone so we can amend
        this.menuItems = [...this.masterListMenu];

        // Add to flat reference List
        this.addMenuItemsToReferenceList(newMenuItems);

        newMenuItems.forEach(loopMenuItem => {
            this.addNewMenuItemToEntities(newMenuItems, loopMenuItem);
        });

        // Remove the unatuhorised
        this.menuItems = this.removeUnauthorisedMenuItems(this.menuItems);

        this.menuStore.update({ menuItems: this.menuItems });
    }

    public addRoute(route: Route, roles: string[] = null) {
        this.log.info(`Adding Route ${JSON.stringify(route)}`);
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
