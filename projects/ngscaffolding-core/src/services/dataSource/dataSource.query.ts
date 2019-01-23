import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DataSourceState, DataSourceStore } from './dataSource.store';
import { DataSetResults } from '@ngscaffolding/models';

@Injectable({
  providedIn: 'root'
})
export class DataSourceQuery extends QueryEntity<DataSourceState, DataSetResults> {

  isInitialised$ = this.select(state => state.isInitialised);

  constructor(protected store: DataSourceStore) {
    super(store);
  }


}
