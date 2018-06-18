import { Component, Inject, forwardRef } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettingsService, ReferenceValuesService, UserAuthorisationService } from '../../../modules/core/coreModule';

@Component({
  selector: 'app-topbar',
  templateUrl: 'app.topbar.template.html',
  styleUrls: ['app.topbar.component.scss']
})
export class AppTopBarComponent {
  public title: string;

  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    public appSettings: AppSettingsService,
    private referenceValuesService: ReferenceValuesService,
    public userAuthService: UserAuthorisationService
  ) {
  }

  public logoff(): void {
    this.userAuthService.logoff();
  }
}
