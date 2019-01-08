import { Component, Inject, forwardRef } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettingsQuery, AppSettingsService, ReferenceValuesService, UserAuthorisationBase } from 'ngscaffolding-core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-topbar',
  templateUrl: 'app.topbar.template.html',
  styleUrls: ['app.topbar.component.scss']
})
export class AppTopBarComponent {
  public title: string;

  public title$: Observable<any>;

  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    public appSettings: AppSettingsService,
    public appSettingQuery: AppSettingsQuery,
    private referenceValuesService: ReferenceValuesService,
    public userAuthService: UserAuthorisationBase
  ) {
    this.title$ = appSettingQuery.selectEntity('title', entity => entity.value);
  }

  public logoff(): void {
    this.userAuthService.logoff();
  }
}
