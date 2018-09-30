import { Route } from '@angular/router';
import { ToolBarComponent } from '../modules/datagrid/components/toolBar/toolBar.component';
import { MachineDetailsComponent } from '../modules/fieldForce/pages/Finder/MachineDetails/machineDetails.component';

export function addDynamicDatagridComponents(config: Array<Route>, modulePath: string) {

      config.forEach(root => {
        if (root.children && root.children.length === 0) {
          root.children.push(
                      {
                         path: 'toolbar', component: ToolBarComponent, outlet: 'popup'
                      }
                    );
                    root.children.push(
                    {
                      path: 'fieldforcemachinedetails', component: MachineDetailsComponent, outlet: 'popup' }
                    );

          // const foundChild: any = root.children.find(child => (child as any)._loadedConfig && child.path === modulePath);
          // if (foundChild && foundChild._loadedConfig.routes.length > 0) {
          //   foundChild._loadedConfig.routes.forEach(childRoute => {
          //     if (childRoute.data && childRoute.data.addDynamicChild) {
          //       if (!childRoute.children) {
          //         childRoute.children = [];
          //       }
          //       const foundDynamicChild = childRoute.children.find(child => child.path === 'dynamic');
          //       if (!foundDynamicChild) {
          //         childRoute.children.push(
          //           {
          //             path: 'dynamic'
          //           }
          //         );
          //         configIsChanged = true;
          //       }
          //     }
          //   });
          // }
        }
      });
}
