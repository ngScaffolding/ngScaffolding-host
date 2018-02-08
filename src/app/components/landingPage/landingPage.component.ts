import { Component } from '@angular/core';

@Component({
    templateUrl: 'landingPage.component.html'
})
export class LandingPageComponent {
    public throwError(): void {
        throw new Error('Oh oh, an error has occured');
    }
}
