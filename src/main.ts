import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { LicenseManager } from 'ag-grid-enterprise';


if (environment.production) {
  enableProdMode();
}

LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__17_November_2018__MTU0MjQxMjgwMDAwMA==e6e57614394e82591f7af9baff0981a4');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
