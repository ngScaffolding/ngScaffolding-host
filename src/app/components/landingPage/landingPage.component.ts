import { Component, ElementRef } from '@angular/core';
import { SpinnerService, ComponentLoaderService } from 'ngscaffolding-core';

@Component({
    templateUrl: 'landingPage.component.html'
})
export class LandingPageComponent {
  constructor(private spinner: SpinnerService, private componentLoader: ComponentLoaderService, private elementRef: ElementRef) {

  }
    public throwError(): void {
        this.spinner.showSpinner('Whee');

    }
}
