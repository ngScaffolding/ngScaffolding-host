import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VersionsService } from '../core/coreModule';

import { InputBuilderComponent } from './inputBuilder/inputBuilder.component';

import {
  InputTextModule,
  InputSwitchModule,
  CalendarModule,
  EditorModule,
  ListboxModule,
  InputTextareaModule,
  ColorPickerModule,
  SpinnerModule,
  SliderModule,
  ChipsModule,
  CheckboxModule,
  SelectButtonModule,
  RadioButtonModule,
  DropdownModule,
  TriStateCheckboxModule,
  PasswordModule,
  RatingModule,
  AutoCompleteModule,
  MultiSelectModule, ToggleButtonModule, TooltipModule
} from 'primeng/primeng';

// import { SampleComponent } from './sample.component';
// import { SampleDirective } from './sample.directive';
// import { SamplePipe } from './sample.pipe';
// import { SampleService } from './sample.service';

export * from './inputBuilder/inputBuilder.component';
export * from './models/inputDetail.model';
export * from './models/inputBuilderDefinition.model';

@NgModule({
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule,
    EditorModule,
    ListboxModule,
    SelectButtonModule,
    ColorPickerModule,
    SliderModule,
    ChipsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    InputTextModule,
    SpinnerModule,
    CalendarModule,
    TriStateCheckboxModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,
    PasswordModule,
    RatingModule,
    MultiSelectModule, ToggleButtonModule, TooltipModule
  ],
  declarations: [
    InputBuilderComponent
    // SampleComponent,
    // SampleDirective,
    // SamplePipe
  ],
  exports: [
    InputBuilderComponent
    // SampleComponent,
    // SampleDirective,
    // SamplePipe
  ]
})
export class InputBuilderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: InputBuilderModule,
      providers: [
        // SampleService
      ]
    };
  }
  constructor(versions: VersionsService) {
    versions.addVersion('@ngscaffolding/inputbuilder', VERSION.version);
  }
}
