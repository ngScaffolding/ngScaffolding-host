import { Component, Inject, forwardRef } from '@angular/core';
import { AppComponent } from '../../../app.component';

@Component({
    selector: '[notifications]',
    templateUrl: 'notifications.component.html'
})
export class NotificationsComponent {
    constructor( @Inject(forwardRef(() => AppComponent)) public app: AppComponent) { }
}
