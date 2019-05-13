import { MenuTypes, GridViewDetail, SystemDataSourceNames, ColumnModel, ButtonColours } from '@ngscaffolding/models';
import { MenuService } from 'ngscaffolding-core';

export function buildMenu(menuService: MenuService) {

  // User Admin Functions
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
                type: 'angularComponent',
                angularComponent: 'users',
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
