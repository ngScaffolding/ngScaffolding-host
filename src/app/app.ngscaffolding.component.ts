import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer,
  ViewChild,
  OnDestroy,
  OnInit,
  NgZone
} from '@angular/core';

import { Router, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map, filter, scan } from 'rxjs/operators';

import { UserPreferenceValue, AppSettings } from '@ngscaffolding/models';
import { LoggingService, AppSettingsService, SpinnerService } from 'ngscaffolding-core';
import { UserAuthorisationBase, UserPreferencesService } from 'ngscaffolding-core';
import { BroadcastService, BroadcastTypes, MenuService } from 'ngscaffolding-core';
import { NotificationReceiverService } from './services/notificationReceiver/notificationReceiver.service';
import { AppSettingsQuery } from 'ngscaffolding-core';

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
    public userAuthService: UserAuthorisationBase,
    public titleService: Title,
    public appSettingsQuery: AppSettingsQuery,
    public notificationReceiverService: NotificationReceiverService,
    public spinnerService: SpinnerService,
    public menuService: MenuService,
    public broadcastService: BroadcastService,
    public userPreferencesService: UserPreferencesService
  ) {}

  ngAfterViewInit() {

    this.logger.info('Loaded Main View');
    // Set the window title
    this.appSettingsQuery.selectEntity(AppSettings.title, setting => setting.value).subscribe(value => {
      this.titleService.setTitle(value);
     });

    // Router Events capture here
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(event => {
          this.spinnerService.hideSpinner();
        });

      this.userPreferencesService.preferenceValuesSubject.subscribe(
        prefValues => {
          if (prefValues) {

            if (prefValues.find(p => p.name === 'MenuOrientation')) {
              this.layoutMode = Number(prefValues.find(p => p.name === ' ').value);
            }

            if (prefValues.find(p => p.name === 'CompactMode')) {
              this.layoutCompact = Boolean(prefValues.find(p => p.name === 'CompactMode').value);
            }

            if (prefValues.find(p => p.name === 'DarkMenu')) {
              this.darkMenu = Boolean(prefValues.find(p => p.name === 'DarkMenu').value);
            }

            if (prefValues.find(p => p.name === 'ProfileMode')) {
              this.profileMode = prefValues.find(p => p.name === 'ProfileMode').value;
            }

            if (prefValues.find(p => p.name === 'Theme')) {
              this.changeTheme(prefValues.find(p => p.name === 'Theme').value);
            }

          }
        }
      );


    // Spinner Notification Here
    this.broadcastService.on(BroadcastTypes.SHOW_SPINNER).subscribe(message => {
      this.spinning = true;
      if (message) {
        this.spinMessage = message.toString();
      } else {
        this.spinMessage = '';
      }
    });

    this.broadcastService.on(BroadcastTypes.HIDE_SPINNER).subscribe(message => {
      this.spinning = false;
      this.spinMessage = null;
    });
    // End Spinner
  }

  changeTheme(theme) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
    const layoutLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('layout-css');

    themeLink.href = 'assets/theme/theme-' + theme + '.css';
    layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
}
}
