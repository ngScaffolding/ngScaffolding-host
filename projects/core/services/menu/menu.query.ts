import { Injectable } from '@angular/core';
import { QueryEntity, QueryConfig, Order } from '@datorama/akita';
import { CoreMenuItem } from 'ngscaffolding-models';
import { MenuStore, MenuState } from './menu.store';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({
  sortBy: 'order',
  sortByOrder: Order.ASC // Order.DESC
})
export class MenuQuery extends QueryEntity<MenuState, CoreMenuItem> {
  constructor(protected store: MenuStore) {
    super(store);
  }
}
