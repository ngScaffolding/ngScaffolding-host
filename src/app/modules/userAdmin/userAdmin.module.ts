import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuService } from 'ngscaffolding-core';

import { UserAdminRoutingModule } from './userAdmin-routing.module';
import { UserListComponent } from './pages/userList/userList.component';
import { MenuTypes, GridViewDetail, ColumnModel, SystemDataSourceNames, ButtonColours } from '@ngscaffolding/models';

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
        roles: ['user_admin', 'admin'],
        items: [
          {
            name: 'user.admin.list',
            routerLink: 'datagrid/user.admin.list',
            roles: ['user_admin', 'admin'],
            label: 'User List',
            icon: 'people',
            type: MenuTypes.Datagrid,
            menuDetails: <GridViewDetail>{
              title: 'User List',
              selectDataSourceName: SystemDataSourceNames.USERS_SELECT,
              columns: [
                <ColumnModel>{ field: 'userId', headerName: 'User ID' },
                <ColumnModel>{ field: 'email', headerName: 'Email Address' },
                <ColumnModel>{ field: 'firstName', headerName: 'First Name' },
                <ColumnModel>{ field: 'lastName', headerName: 'Last Name' }
              ],
              actions: [
                {
                  columnButton: true, title: 'Edit User', icon: 'ui-icon-assignment', colour: ButtonColours.teal, type: 'angularroute',
                  angularRoute: 'userdetails',
                  dialogOptions: {
                    header : 'Device Details',
                    width : 900,
                    height : 800,
                    maximizable : true
                }
                }
              ]
            }
          }
        ]
      }
    ]);
  }
}
