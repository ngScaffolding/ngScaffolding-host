import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VERSION } from './version';

// Pipes
import { ButtonColourPipe } from './pipes/buttonColour.pipe';
import { NgsDateTimePipe } from './pipes/ngsDateTime.pipe';
import { NgsDatePipe } from './pipes/ngsDate.pipe';
import { TruncateTextPipe } from './pipes/truncateText.pipe';

// Directives
import { FillHeightDirective } from './directives/fill-height.directive';

// Services
import { VersionsService } from './services/versions/versions.service';

// Components
import { DialogWindowComponent } from './components/dialogWindow/dialogWindow.component';

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule],
    declarations: [FillHeightDirective, ButtonColourPipe, NgsDatePipe, NgsDateTimePipe, TruncateTextPipe, DialogWindowComponent],
    exports: [ButtonColourPipe, NgsDatePipe, NgsDateTimePipe, TruncateTextPipe, FillHeightDirective, DialogWindowComponent]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule
        };
    }
    constructor(versions: VersionsService) {
        versions.addVersion('ngscaffolding-core', VERSION.version);
    }
}
