import { Component } from '@angular/core';
import { SpinnerService } from 'ngscaffolding-core';

@Component({
    templateUrl: 'landingPage.component.html'
})
export class LandingPageComponent {
  constructor(private spinner: SpinnerService){}
    public throwError(): void {
        this.spinner.showSpinner('Whee');
    }
}
