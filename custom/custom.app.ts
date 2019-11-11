 import { FieldforceModule } from '../src/modules/fieldforce/fieldforceModule';
 import { DemoAppModule } from '../src/modules/demoapp/demoappModule';

export const CUSTOM_IMPORTS: any[] = [
  DemoAppModule.forRoot(),
  FieldforceModule.forRoot()
];
export const CUSTOM_COMPONENTS: any[] =  [];
