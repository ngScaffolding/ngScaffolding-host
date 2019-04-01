// import { FieldForceAppModule } from '../src/modules/fieldForce/fieldForceModule';

 import { DemoAppModule } from '../src/modules/demoapp/demoappModule';
 import { DCOAppModule } from '../src/modules/dcoSystems/dcoModule';

export const CUSTOM_IMPORTS: any[] = [
  // FieldForceAppModule.forRoot()
  DCOAppModule.forRoot(),
  DemoAppModule.forRoot()
];
export const CUSTOM_COMPONENTS: any[] =  [];
