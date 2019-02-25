import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserPreferencesService, UserPreferencesQuery } from 'ngscaffolding-core';
import { InputBuilderDefinition, OrientationValues, InputDetail, UserPreferenceValue } from '@ngscaffolding/models';
import { take } from 'rxjs/internal/operators/take';
import { combineLatest, Observable, Subscription } from 'rxjs';

@Component({
  templateUrl: './userSettings.component.html',
  styleUrls: ['./userSettings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  private baseInputDefinition: InputBuilderDefinition = {
    inputDetails: [],
    columnCount: 3,
    orientation: OrientationValues.Horizontal
  };

  constructor(private userPrefs: UserPreferencesService, private userPrefsQuery: UserPreferencesQuery) {}

  inputBuilderDefinition = new InputBuilderDefinition();

  obsLoading: Observable<[UserPreferenceValue[], boolean]>;
  obsSubscription: Subscription;

  userPrefsModel: {};

  ngOnInit() {
    // Load Preference Definitions Here
    this.userPrefsQuery
      .select(prefsState => prefsState.preferenceDefinitions)
      .subscribe(defs => {
        if (defs) {
          // Build our Input Definition from this input
          const newInputDefinition = Object.assign({}, this.baseInputDefinition);

          defs.forEach((value, key) => {
            const inputDef = JSON.parse(JSON.stringify(value.inputDetails));
            if (inputDef && inputDef.name) {
              newInputDefinition.inputDetails.push(inputDef as InputDetail);
            }
          });

          this.inputBuilderDefinition = newInputDefinition;
        }
      });

    // Load User Values Here
    this.obsLoading = combineLatest(this.userPrefsQuery.selectAll(), this.userPrefsQuery.selectLoading());
    this.obsSubscription = this.obsLoading.subscribe(([values, loading]) => {
      if (values && !loading) {
        const newValues = {};
        values.forEach((prefValue, key) => {
          newValues[prefValue.name] = prefValue.value;
        });
        this.userPrefsModel = newValues;
        this.obsSubscription.unsubscribe();
      }
    });
  }

  valueChanged(changedValue: [string, any]) {
    // Save updates
    this.userPrefs.setValue(changedValue[0], changedValue[1]).subscribe();
  }

  notifyChanged(changedValue: any) {}
}
