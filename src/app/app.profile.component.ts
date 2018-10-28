import {Component} from '@angular/core';
import {AppComponent} from './app.component';
import { AppSettingsService, UserAuthorisationBase } from 'ngscaffolding-core';
import {trigger, state, transition, style, animate} from '@angular/animations';

@Component({
    selector: 'app-inline-profile',
    template: `
        <div class="profile" [ngClass]="{'profile-expanded':active}">
            <a href="#" (click)="onClick($event)">
                <img *ngIf="appSettings.showProfilePicture" class="profile-image" src="assets/layout/images/avatar.png" />
                <span class="profile-name">{{authService.currentUser?.name}}</span>
                <i class="material-icons">keyboard_arrow_down</i>
            </a>
        </div>

        <ul class="ultima-menu profile-menu" [@menu]="active ? 'visible' : 'hidden'">
            <li role="menuitem" *ngIf="appSettings.showProfileSetting">
                <a href="#" routerLink="/profile"  class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">person</i>
                    <span>Profile</span>
                </a>
            </li>
            <li role="menuitem" *ngIf="appSettings.showUserSetting">
                <a href="#" routerLink="usersettings" class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">settings_application</i>
                    <span>Settings</span>
                </a>
            </li>
            <li role="menuitem">
                <a href="#" routerLink="about" class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">description</i>
                    <span>About</span>
                </a>
            </li>
            <li role="menuitem">
                <a href="#" routerLink="logoff" class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">power_settings_new</i>
                    <span>Logout</span>
                </a>
            </li>
        </ul>
    `,
    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppInlineProfileComponent {

    active: boolean;

    constructor(public app: AppComponent, public appSettings: AppSettingsService, public authService: UserAuthorisationBase) {}

    onClick(event) {
        this.active = !this.active;
        setTimeout(() => {
          this.app.layoutMenuScrollerViewChild.moveBar();
        }, 450);
        event.preventDefault();
    }
}
