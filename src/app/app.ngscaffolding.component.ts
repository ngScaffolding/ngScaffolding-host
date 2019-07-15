import { Component, AfterViewInit } from '@angular/core';

import { Router, NavigationEnd, NavigationError, NavigationStart, RouterEvent, NavigationCancel } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { AppSettings } from 'ngscaffolding-models';
import { AppSettingsQuery, UserPreferencesQuery, LoggingService, SpinnerService,UserAuthenticationQuery, BroadcastService, BroadcastTypes, MenuService } from 'ngscaffolding-core';
import { NotificationReceiverService } from './services/notificationReceiver/notificationReceiver.service';

enum MenuOrientation {
  STATIC,
  OVERLAY,
  SLIM,
  HORIZONTAL
}

@Component({ selector: 'app-ng-root', template: '<h3>Loading</h3>' })
export class NgScaffoldingComponent implements AfterViewInit {
  public spinning: boolean;
  public spinMessage: string;

  layoutMode: number;
  layoutCompact: boolean;
  darkMenu: boolean;
  profileMode: string;

  constructor(
    public router: Router,
    public logger: LoggingService,
    public authQuery: UserAuthenticationQuery,
    public titleService: Title,
    public appSettingsQuery: AppSettingsQuery,
    public notificationReceiverService: NotificationReceiverService,
    public spinnerService: SpinnerService,
    public menuService: MenuService,
    public broadcastService: BroadcastService,
    public userPrefsQuery: UserPreferencesQuery
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this._navigationInterceptor(event);
    })
  }

  private _navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.spinnerService.showSpinner('Loading');
      }
    if (event instanceof NavigationEnd) {
      this.spinnerService.hideSpinner();
    }
    if (event instanceof NavigationCancel) {
      this.spinnerService.hideSpinner();
    }
    if (event instanceof NavigationError) {
      this.spinnerService.hideSpinner();
    }
  }

  ngAfterViewInit() {
    this.logger.info('Loaded Main View');
    // Set the window title
    this.appSettingsQuery
      .selectEntity(AppSettings.title, setting => setting.value)
      .subscribe(value => {
        this.titleService.setTitle(value);
      });

    // Router Events capture here
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.spinnerService.hideSpinner();
    });

    this.authQuery.authenticated$.subscribe(auth => {
      if (auth) {
        this.userPrefsQuery.selectEntity('MenuOrientation').subscribe(prefValue => {
          if (prefValue) {
            this.layoutMode = Number(prefValue.value);
          }
        });

        this.userPrefsQuery.selectEntity('CompactMode').subscribe(prefValue => {
          if (prefValue) {
            this.layoutCompact = Boolean(prefValue.value);
          }
        });

        this.userPrefsQuery.selectEntity('DarkMenu').subscribe(prefValue => {
          if (prefValue) {
            this.darkMenu = Boolean(prefValue.value);
          }
        });

        this.userPrefsQuery.selectEntity('ProfileMode').subscribe(prefValue => {
          if (prefValue) {
            this.profileMode = prefValue.value;
          }
        });

        this.userPrefsQuery.selectEntity('Theme').subscribe(prefValue => {
          if (prefValue) {
            this.changeTheme(prefValue.value);
          }
        });
      }
    });

    // Spinner Notification Here
    this.broadcastService.on(BroadcastTypes.SHOW_SPINNER).subscribe(message => {
      this.spinning = true;
      if (message) {
        this.spinMessage = message.toString();
      } else {
        this.spinMessage = 'Loading';
      }
    });

    this.broadcastService.on(BroadcastTypes.HIDE_SPINNER).subscribe(message => {
      this.spinning = false;
      this.spinMessage = null;
    });
    // End Spinner
  }

  changeTheme(theme) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
    const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');

    themeLink.href = 'assets/theme/theme-' + theme + '.css';
    layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
  }
}
