import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserPreferencesQuery, NotificationService, UserPreferencesService } from 'ngscaffolding-core';
import { InputBuilderDefinition, PreferenceTypes } from 'ngscaffolding-models';

@Component({
  templateUrl: './profilePage.component.html',
  styleUrls: ['./profilePage.component.scss']
})
export class ProfilePageComponent implements OnInit {
  constructor(private userPrefsQuery: UserPreferencesQuery, private userPrefsService: UserPreferencesService, private notification: NotificationService) {}

  inputBuilderDefinition = new InputBuilderDefinition();

  userPrefsModel: any = {};

  ngOnInit() {
    // Load Preference Definitions Here
    this.userPrefsQuery.select(prefsState => prefsState.preferenceDefinitions).subscribe(defs => {
      if (defs) {
        const profile = defs.find(def => def.name === PreferenceTypes.UserPrefs_Profile);

        if (profile) {
          this.inputBuilderDefinition = JSON.parse(JSON.stringify(profile.inputDetails));
        }
      }
    });

    // Load User Values Here
    this.userPrefsQuery.selectEntity(PreferenceTypes.UserPrefs_Profile).subscribe(profile => {
      if (profile) {
        this.userPrefsModel = JSON.parse(profile.value);
      }
     });
  }

  valueChanged(changedValue: [string, any]) {}

  notifyChanged(changedValue: any) {}

  okClicked(changedModel: any) {
    this.userPrefsService.setValue(PreferenceTypes.UserPrefs_Profile, JSON.stringify(changedModel)).subscribe(() => {
      this.notification.showMessage({severity: 'success', summary: 'Complete', detail: 'Profile Saved' });
    });
  }
}
