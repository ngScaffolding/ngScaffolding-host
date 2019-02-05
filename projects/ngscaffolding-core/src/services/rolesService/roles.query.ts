import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Role } from '@ngscaffolding/models';
import { RoleState, RolesStore } from './roles.store';

@Injectable({
  providedIn: 'root'
})
export class RolesQuery extends QueryEntity<RoleState, Role> {
  constructor(protected store: RolesStore) {
    super(store);
  }
}
