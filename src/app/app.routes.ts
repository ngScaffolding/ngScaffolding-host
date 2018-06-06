import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LandingPageComponent } from './components/landingPage/landingPage.component';
import { LoginPageComponent } from './pages/login/loginPage.component';
import { LogoffPageComponent } from './pages/logoff/logoffPage.component';

import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';
import { AboutComponent } from './pages/about/about.component';

import { UserSettingsComponent } from './pages/userSettings/userSettings.component';
import { ProfilePageComponent } from './pages/profile/profilePage.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'logoff', component: LogoffPageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'usersettings', component: UserSettingsComponent },
  { path: 'profile', component: ProfilePageComponent},
  { path: '**', component: PageNotFoundComponent }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, { enableTracing: true });
