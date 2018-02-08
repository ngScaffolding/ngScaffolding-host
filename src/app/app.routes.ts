import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LandingPageComponent } from './components/landingPage/landingPage.component';
import { LoginPageComponent } from './pages/login/loginPage.component';
import { LogoffPageComponent } from './pages/logoff/logoffPage.component';

import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'logoff', component: LogoffPageComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
