import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppSettingsService, AppSettingsQuery } from 'ngscaffolding-core';
import { CoreMenuItem, WidgetDetails } from '@ngscaffolding/models';

@Component({
  selector: 'ngs-widget-container',
  templateUrl: './widgetContainer.component.html',
  styleUrls: ['./widgetContainer.component.scss'],
  animations: [
    trigger('toolBarShown', [
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
    ]),
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

  @Output() widgetEvent = new EventEmitter<string>();

  allowClose: boolean;
  allowInputs: boolean;
  showToolbar = false;

  public expanded = false;

  public mouseLeave() {
    this.showToolbar = false;
  }

  public mouseEnter() {
    if (this.IsReadOnly) {
      this.showToolbar = false;
      this.allowClose = false;
      this.allowInputs = false;
      return;
    }

    if (this.widgetDetails.widget.inputBuilderDefinition) {
      this.allowInputs = true;
    }

    this.allowClose = true;

    this.showToolbar = this.allowClose || this.allowInputs;
  }

  public toggleMenu() {
    this.expanded = !this.expanded;
  }

  public buttonClicked(name: string) {
    this.widgetEvent.emit(name);
  }

  ngOnChanges(changes: SimpleChanges) {}
}
