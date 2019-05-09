import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthoriseRoleGuard } from 'ngscaffolding-core';

import { LandingPageComponent } from './components/landingPage/landingPage.component';
import { LoginPageComponent } from './pages/login/loginPage.component';
import { LogoffPageComponent } from './pages/logoff/logoffPage.component';

import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';
import { AboutComponent } from './pages/about/about.component';

import { UserSettingsComponent } from './pages/userSettings/userSettings.component';
import { ProfilePageComponent } from './pages/profile/profilePage.component';
import { UserListComponent } from './modules/userAdmin/pages/userList/userList.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [AuthoriseRoleGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'logoff', component: LogoffPageComponent, canActivate: [AuthoriseRoleGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthoriseRoleGuard] },
  { path: 'usersettings', component: UserSettingsComponent, canActivate: [AuthoriseRoleGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthoriseRoleGuard] },
  {
    path: '',
    component: LandingPageComponent, canActivate: [AuthoriseRoleGuard],
    pathMatch: 'full',
  },

  // TODO: Lazy loaded User Admin Module

  { path: 'users', loadChildren: './modules/userAdmin/userAdmin.module#UserAdminModule' },


  // Catch all
  { path: '**', component: PageNotFoundComponent, canActivate: [AuthoriseRoleGuard] }

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, { enableTracing: true });
