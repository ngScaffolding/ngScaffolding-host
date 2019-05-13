import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuService } from 'ngscaffolding-core';

import { UserListComponent } from './pages/userList/userList.component';
import { UserDetailsComponent } from './pages/userDetails/userDetails.component';
import { MenuTypes, GridViewDetail, ColumnModel, SystemDataSourceNames, ButtonColours } from '@ngscaffolding/models';

import { UserAdminRoutingModule } from './userAdmin-routing.module';


@NgModule({
  declarations: [UserListComponent, UserDetailsComponent],
  imports: [CommonModule, UserAdminRoutingModule]
})
export class UserAdminModule {
  constructor(private menuService: MenuService) {

  }
}
