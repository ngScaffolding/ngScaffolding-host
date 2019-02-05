import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Role } from '@ngscaffolding/models';

export interface RoleState extends EntityState<Role> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'role', idKey: 'name' })
export class RolesStore extends EntityStore<RoleState, Role> {

  constructor() {
    super();
    console.log('RoleStore Constructor');
  }
}

