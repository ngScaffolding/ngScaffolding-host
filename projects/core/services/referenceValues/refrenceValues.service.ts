import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { ReferenceValue, AppSettings } from 'ngscaffolding-models';
import { LoggingService } from '../logging/logging.service';
import { ReferenceValuesQuery } from './referenceValues.query';
import { ReferenceValuesStore } from './referenceValues.store';

@Injectable({
  providedIn: 'root'
})
export class ReferenceValuesService {
  private className = 'ReferenceValuesService';

  private requestsInFlight = new Map<string, Observable<ReferenceValue>>();

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private refValuesQuery: ReferenceValuesQuery,
    private refValuesStore: ReferenceValuesStore,
    private logger: LoggingService
  ) {}

  //
  // Get a single string value from References
  //
  getValue(name: string, group: string): Observable<string> {
    return new Observable<string>(observer => {
      this.getReferenceValue(name, group).subscribe(reference => {
        if (reference) {
          observer.next(reference.value);
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    });
  }

  clearReferenceValue(name: string, seed = '') {
    this.refValuesStore.remove(this.getKey(name, seed));
  }

  setReferenceValue(referenceValue: ReferenceValue) {
    referenceValue.compositeKey = this.getKey(referenceValue.name, '');
    this.refValuesStore.upsert(this.getKey(referenceValue.name, ''), referenceValue);
  }

  //
  // Get a complex ReferenceValue (May include multiple values)
  //
  getReferenceValue(name: string, seed = '', childDepth = 0): Observable<ReferenceValue> {
    if (this.refValuesQuery.hasEntity(this.getKey(name, seed))) {
      // If we get one from Cache, thats handy to use
      return new Observable<ReferenceValue>(observer => {
        observer.next(this.refValuesQuery.getEntity(this.getKey(name, seed)));
        observer.complete();
      });
    } else if (childDepth > 0) {
      const refValue = this.refValuesQuery.getEntity(this.getKey(name, ''));
      if (refValue) {
        const parentRef = refValue.referenceValueItems.find(parent => parent.value === seed);
        if (parentRef) {
          const clone = { ...refValue };
          clone.referenceValueItems = parentRef.referenceValueItems;

          return new Observable<ReferenceValue>(observer => {
            observer.next(clone);
            observer.complete();
          });
        }
      }
    } else {
      // Nothing in the Cache
      if (this.requestsInFlight.has(this.getKey(name, seed))) {
        // We have already asked for this, return our existing Observable
        return this.requestsInFlight.get(this.getKey(name, seed));
      } else {
        const wrapper = new Observable<ReferenceValue>(observer => {
          // Call HTTP Here
          const httpRequest = this.http.get<ReferenceValue>(
            `${this.appSettingsService.getValue(AppSettings.apiHome)}/api/v1/referencevalues?name=${name}&seed=${seed}`
          );
          httpRequest.subscribe(value => {
            value.compositeKey = this.getKey(name, seed);
            this.refValuesStore.upsert(this.getKey(name, seed), value);
            this.requestsInFlight.delete(this.getKey(name, seed));

            observer.next(value);
            observer.complete();
          });
        });

        this.requestsInFlight.set(this.getKey(name, seed), wrapper);
        return wrapper;
      }
    }
  }

  private getKey(name: string, seed: string): string {
    return `${name}::${seed}`;
  }
}
