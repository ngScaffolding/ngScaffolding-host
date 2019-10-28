import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuService, ComponentLoaderService, LoggingService } from 'ngscaffolding-core';

import { UserListComponent } from './pages/userList/userList.component';
import { UserDetailsComponent } from './pages/userDetails/userDetails.component';

import { UserAdminRoutingModule } from './userAdmin-routing.module';
import { createCustomElement } from '@angular/elements';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';

@NgModule({
  declarations: [UserListComponent, UserDetailsComponent],
  imports: [CommonModule, InputBuilderModule, UserAdminRoutingModule],
  entryComponents: [UserDetailsComponent]
})
export class UserAdminModule {
  constructor(
    injector: Injector, menuService: MenuService,  componentLoaderService: ComponentLoaderService,  logger: LoggingService) {

    logger.info('Setting Values UserAdminModule.startup');

    // registering our Angular Component
    const el = createCustomElement(UserDetailsComponent, { injector });
    customElements.define('app-user-details', el);

    componentLoaderService.registerComponent('app-user-details');
  }
}
