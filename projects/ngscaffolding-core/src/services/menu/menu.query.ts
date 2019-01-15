import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CoreMenuItem } from '@ngscaffolding/models';
import { MenuStore, MenuState } from './menu.store';

@Injectable({
  providedIn: 'root'
})
export class MenuQuery extends QueryEntity<MenuState, CoreMenuItem> {
  public menuItemsList$ = this.select(state => state.menuItems);

  constructor(protected store: MenuStore) {
    super(store);
  }

}
