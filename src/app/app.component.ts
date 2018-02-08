import { Router, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { Component, AfterViewInit, ElementRef, Renderer, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { NotificationReceiverService } from './services/notificationReceiver/notificationReceiver.service';

import { LoggingService, AppSettingsService, SpinnerService, UserAuthorisationService } from '@ngscaffolding/core';
import { BroadcastService, BroadcastTypes, MenuService } from '@ngscaffolding/core';
import { setTimeout } from 'timers';

enum MenuOrientation {
    STATIC,
    OVERLAY,
    HORIZONTAL
};

declare var jQuery: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    // spinner Details
    spinning: boolean;
    spinMessage: string;

    layoutCompact = false;

    layoutMode: MenuOrientation = MenuOrientation.HORIZONTAL;

    darkMenu = false;

    profileMode = 'inline';

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    layoutContainer: HTMLDivElement;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    documentClickListener: Function;

    resetMenu: boolean;

    @ViewChild('layoutContainer') layourContainerViewChild: ElementRef;

    @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ElementRef;

    constructor(
        private router: Router,
        public renderer: Renderer,
        private userAuthService: UserAuthorisationService,
        public logger: LoggingService,
        public titleService: Title,
        public appSettingsService: AppSettingsService,
        private notificationReceiverService: NotificationReceiverService,
        private spinnerService: SpinnerService,
        private menuService: MenuService,
        private broadcastService: BroadcastService) {

        this.broadcastService.on('logoff').subscribe((data) => {
            // Redirect to logoff screen
            this.logger.info('App Component Detected Logoff');
         });

         this.menuService.routeSubject.subscribe(routes => {
                if (routes) {
                    routes.forEach(route => {
                    router.config.push(route);
                });
            }
         });

         this.userAuthService.authenticatedSubject.subscribe(isAuthenticated => {
            if (isAuthenticated) {
                this.router.navigateByUrl('');
            }else {
                this.router.navigateByUrl('login');
            }
        });
    }

    ngAfterViewInit() {
        this.logger.info('Loaded Main View');

        // Set the window title
        this.titleService.setTitle(this.appSettingsService.title);

        this.layoutContainer = <HTMLDivElement>this.layourContainerViewChild.nativeElement;
        this.layoutMenuScroller = <HTMLDivElement>this.layoutMenuScrollerViewChild.nativeElement;

        // hides the horizontal submenus or top menu if outside is clicked
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
            if (!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if (!this.menuClick && this.isHorizontal()) {
                this.resetMenu = true;
            }

            this.topbarItemClick = false;
            this.menuClick = false;
        });

        setTimeout(() => {
            jQuery(this.layoutMenuScroller).nanoScroller({ flash: true });
        }, 10);

        

        // Router Events capture here
        this.router.events
        .filter((event) => event instanceof NavigationEnd)
        .subscribe((event) => {
            this.spinnerService.hideSpinner();
        });

        // Spinner Notification Here
       this.broadcastService.on(BroadcastTypes.SHOW_SPINNER).subscribe(message => {
            this.spinning = true;
            if (message) {
                this.spinMessage = message.toString()
            }else {
                this.spinMessage = '';
            }
          });

          this.broadcastService.on(BroadcastTypes.HIDE_SPINNER).subscribe(message => {
            this.spinning = false;
            this.spinMessage = null;
          });
          // End Spinner
    }

    onMenuButtonClick(event) {
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        else {
            if (this.isDesktop())
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            else
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if (!this.isHorizontal()) {
            setTimeout(() => {
                jQuery(this.layoutMenuScroller).nanoScroller();
            }, 500);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        if (this.overlayMenuActive || this.staticMenuMobileActive) {
            this.rotateMenuButton = false;
            this.overlayMenuActive = false;
            this.staticMenuMobileActive = false;
        }

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item)
            this.activeTopbarItem = null;
        else
            this.activeTopbarItem = item;

        event.preventDefault();
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }

        jQuery(this.layoutMenuScroller).nanoScroller({ flash: true });
    }
}
