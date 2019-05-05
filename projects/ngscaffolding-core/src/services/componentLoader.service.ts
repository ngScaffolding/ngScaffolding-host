import { Injectable, NgModuleFactoryLoader, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentLoaderService {
  private componentRegistry = {
    'lazy-component': {
      modulePath: './lazy-components/lazy-components.module#LazyComponentsModule',
      moduleRef: null
    }
  };

  constructor(private loader: NgModuleFactoryLoader, private injector: Injector) {}

  registerComponent(name: string, modulePath: string) {
    if (!this.componentRegistry[name]) {
      this.componentRegistry[name] = {
        modulePath: modulePath,
        moduleRef: null
      };
    }
  }

  loadComponent(componentTag: string): Promise<HTMLElement> {
    const cmpRegistryEntry = this.componentRegistry[componentTag];
    if (!cmpRegistryEntry) {
      throw new Error(`Unrecognized component "${componentTag}". Make sure it is registered in the component registry`);
    }

    if (cmpRegistryEntry.moduleRef) {
      return new Promise(resolve => {
        const componentInstance = document.createElement(componentTag);
        resolve(componentInstance);
      });
    } else {
      const path = cmpRegistryEntry.modulePath;

      return new Promise((resolve, reject) => {
        this.loader
          .load(path)
          .then(moduleFactory => {
            const moduleRef = moduleFactory.create(this.injector).instance;
            cmpRegistryEntry.moduleRef = moduleRef;

            // instantiate the component
            const componentInstance = document.createElement(componentTag);
            resolve(componentInstance);
          })
          .catch(err => {
            console.error('error loading module', err);
            reject(err);
          });
      });
    }
  }
}
