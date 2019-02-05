import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuService } from 'ngscaffolding-core';

import { UserAdminRoutingModule } from './userAdmin-routing.module';
import { UserListComponent } from './pages/userList/userList.component';
import { MenuTypes, GridViewDetail, ColumnModel } from '@ngscaffolding/models';

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, UserAdminRoutingModule]
})
export class UserAdminModule {
  constructor(private menuService: MenuService) {
    menuService.addMenuItemsFromCode([
      {
        label: 'User Administration',
        type: MenuTypes.Folder,
        icon: 'person_add',
        roles: ['user_admin'],
        items: [
          {
            name: 'user.admin.list',
            routerLink: 'datagrid/user.admin.list',
            roles: ['user_admin'],
            label: 'User List',
            icon: 'people',
            type: MenuTypes.Datagrid,
            menuDetails: <GridViewDetail>{
              title: 'User List',
              columns: [<ColumnModel>{ field: 'userId', headerName: 'User ID' }]
            }
          }
        ]
      }
    ]);
  }
}
