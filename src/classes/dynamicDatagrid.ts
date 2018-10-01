import { Route, Router } from '@angular/router';
import { DynamicComponentService } from '../modules/core/services/dynamicComponent/dynamicComponent.service';

export function addDynamicDatagridComponents(config: Array<Route>, dynamicComponentService: DynamicComponentService) {

      config.forEach(root => {
          const compRoutes = dynamicComponentService.getComponents();
          compRoutes.forEach(route => {
            // Push the child version
            root.children.push(route);
          });
        });
}
