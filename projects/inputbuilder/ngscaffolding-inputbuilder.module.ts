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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { SliderModule } from 'primeng/slider';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { SpinnerModule } from 'primeng/spinner';
import { CalendarModule } from 'primeng/calendar';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { RatingModule } from 'primeng/rating';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslateModule } from '@ngx-translate/core';

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
    MultiSelectModule,
    ToggleButtonModule,
    TooltipModule,
    NgJsonEditorModule,
    FileUploadModule,
    TranslateModule
  ],
  declarations: [EditableTitleComponent, InputBuilderComponent, InputBuilderPopupComponent],
  exports: [EditableTitleComponent, InputBuilderComponent, InputBuilderPopupComponent]
})
export class InputBuilderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: InputBuilderModule
    };
  }
  constructor(versions: VersionsService) {
    versions.addVersion('ngscaffolding-inputbuilder', VERSION.version);
  }
}
