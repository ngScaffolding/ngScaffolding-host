import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { VERSION } from './version';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VersionsService, CoreModule } from 'ngscaffolding-core';

import { InputBuilderComponent } from './inputBuilder/inputBuilder.component';
import { InputBuilderPopupComponent } from './inputBuilderPopup/inputBuilderPopup.component';

import { NgJsonEditorModule } from 'ang-jsoneditor';

// Components
import { EditableTitleComponent } from './components/editableTitle/editableTitle.component';

import {
  DialogModule,
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
  InputMaskModule,
  KeyFilterModule,

  MultiSelectModule, ToggleButtonModule, TooltipModule
} from 'primeng/primeng';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    HttpClientModule,
    AutoCompleteModule,
    FormsModule,
    DialogModule,
    EditorModule,
    ListboxModule,
    SelectButtonModule,
    ColorPickerModule,
    SliderModule,
    ChipsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    InputTextModule,
    InputMaskModule,
    SpinnerModule,
    CalendarModule,
    TriStateCheckboxModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,
    PasswordModule,
    RatingModule,
    KeyFilterModule,
    MultiSelectModule, ToggleButtonModule, TooltipModule,
    NgJsonEditorModule
  ],
  declarations: [
    EditableTitleComponent,
    InputBuilderComponent,
    InputBuilderPopupComponent
  ],
  exports: [
    EditableTitleComponent,
    InputBuilderComponent,
    InputBuilderPopupComponent
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
    versions.addVersion('ngscaffolding-inputbuilder', VERSION.version);
  }
}
