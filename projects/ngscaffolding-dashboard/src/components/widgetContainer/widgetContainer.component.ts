import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppSettingsService, AppSettingsQuery } from 'ngscaffolding-core';
import { CoreMenuItem } from '@ngscaffolding/models';

@Component({
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

  @Input() menuItem: CoreMenuItem;
  @Input() IsReadOnly: boolean;

}
