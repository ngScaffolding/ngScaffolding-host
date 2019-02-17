import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ReferenceValuesStore, ReferenceValuesState } from './referenceValues.store';
import { ReferenceValue } from '@ngscaffolding/models';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReferenceValuesQuery extends QueryEntity<ReferenceValuesState, ReferenceValue> {

  isInitialised$ = this.select(state => state.isInitialised);

  constructor(protected store: ReferenceValuesStore) {
    super(store);
  }


}
