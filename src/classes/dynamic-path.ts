import { Route } from '@angular/router';

export function addDynamicPath(config: Array<Route>, modulePath): Promise<Array<Route>> {

  return new Promise((resolve, reject) => {
    // Trigger change detection so _loadedConfig is available in router
    setTimeout(() => {
      let configIsChanged = false;
      config.forEach(root => {
        if (root.children) {
          const foundChild: any = root.children.find(child => (child as any)._loadedConfig && child.path === modulePath);
          if (foundChild && foundChild._loadedConfig.routes.length > 0) {
            foundChild._loadedConfig.routes.forEach(childRoute => {
              if (childRoute.data && childRoute.data.addDynamicChild) {
                if (!childRoute.children) {
                  childRoute.children = [];
                }
                const foundDynamicChild = childRoute.children.find(child => child.path === 'dynamic');
                if (!foundDynamicChild) {
                  childRoute.children.push(
                    {
                      path: 'dynamic'
                    }
                  );
                  configIsChanged = true;
                }
              }
            });
          }
        }
      });
      if (configIsChanged) {
        resolve(config);
      }
      resolve(null);
    }, 0);
  });
}
