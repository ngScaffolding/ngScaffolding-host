import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  VersionsService,
  SoftwareVersion,
  UserPreferencesService
} from '../../../modules/core/coreModule';
import { Subscription } from 'rxjs/Subscription';
import { InputBuilderDefinition } from '../../../modules/inputbuilder/inputbuilderModule';

@Component({
  templateUrl: './userSettings.component.html',
  styleUrls: ['./userSettings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  private prefDetailsSub: Subscription;
  private prefValuesSub: Subscription;

  constructor(private userPrefs: UserPreferencesService) {}

  inputBuilderDefinition = new InputBuilderDefinition();
  userPrefsModel: Array<any> = [];

  ngOnInit() {
    // Load Preference Definitions Here
    this.prefDetailsSub = this.userPrefs.preferenceDefinitionsSubject.subscribe(
      defs => {
        if (defs){
        // Build our Input Definition from this input
        this.inputBuilderDefinition.inputDetails = [];
        defs.forEach((value, key) => {
          const inputDef = JSON.parse(value.inputDetails);
          if (inputDef) {
            this.inputBuilderDefinition.inputDetails.push(inputDef);
          }
        });
      }
      }
    );

    // Load User Values Here
    this.prefValuesSub = this.userPrefs.preferenceValuesSubject.subscribe(values =>{
      values.forEach((value, key) => {
        this.userPrefsModel[key] = value;
      });
    });
  }

  ngOnDestroy() {
    if (this.prefDetailsSub) {
      this.prefDetailsSub.unsubscribe();
    }
    if (this.prefValuesSub) {
      this.prefValuesSub.unsubscribe();
    }
  }
}
