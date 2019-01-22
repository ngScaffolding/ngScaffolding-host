import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppSettingsService, AppSettingsQuery } from 'ngscaffolding-core';
import { CoreMenuItem, WidgetDetails } from '@ngscaffolding/models';

@Component({
  selector: 'ngs-widget-container',
  templateUrl: './widgetContainer.component.html',
  styleUrls: ['./widgetContainer.component.scss'],
  animations: [
    trigger('toolBarExpandedState', [
      state(
        'false',
        style({
          width: '0px',
          opacity: '0',
          overflow: 'hidden'
        })
      ),
      state(
        'true',
        style({
          width: '*',
          opacity: '1'
        })
      ),
      transition('false => true', animate('200ms ease-in')),
      transition('true => false', animate('200ms ease-out'))
    ])
  ]
})
export class WidgetContainerComponent implements OnChanges {
  @Input() widgetDetails: WidgetDetails;
  @Input() IsReadOnly: boolean;

  allowClose: boolean;
  allowInputs: boolean;
  showToolbar: boolean;

  public mouseEnter() {
    if (this.IsReadOnly) {
      this.showToolbar = false;
      this.allowClose = false;
      this.allowInputs = false;
      return;
    }


  }

  ngOnChanges(changes: SimpleChanges) {}
}
