import { Component } from '@angular/core';
import { NgscaffoldingCoreService } from 'ngscaffolding-core';

@Component({
    templateUrl: 'landingPage.component.html'
})
export class LandingPageComponent {
  constructor(private testService: NgscaffoldingCoreService){
    alert('service sayds: ' + this.testService.whatSayYou());
  }
    public throwError(): void {
        throw new Error('Oh oh, an error has occured');
    }
}
