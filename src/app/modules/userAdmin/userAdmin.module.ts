import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuService } from 'ngscaffolding-core';

import { UserListComponent } from './pages/userList/userList.component';
import { UserDetailsComponent } from './pages/userDetails/userDetails.component';
import { MenuTypes, GridViewDetail, ColumnModel, SystemDataSourceNames, ButtonColours } from '@ngscaffolding/models';
import { Routes, RouterModule } from '@angular/router';

import { UserAdminRoutingModule } from './userAdmin-routing.module';

// canActivate: [AuthoriseRoleGuard]

// const appRoutes: Routes = [
//   { path: 'users', component: UserListComponent },
//   { path: 'userdetails', component: UserDetailsComponent, outlet: 'popup' }
// ];

@NgModule({
  declarations: [UserListComponent, UserDetailsComponent],
  imports: [CommonModule, UserAdminRoutingModule]
})
export class UserAdminModule {
  constructor(private menuService: MenuService) {
    menuService.addMenuItemsFromCode([
      {
        label: 'User Administration',
        name: 'user.admin',
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
                  columnButton: true,
                  title: 'Edit User',
                  icon: 'ui-icon-assignment',
                  colour: ButtonColours.teal,
                  type: 'angularroute',
                  angularRoute: 'users',
                  dialogOptions: {
                    header: 'User Details',
                    width: 900,
                    height: 800,
                    maximizable: true
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
