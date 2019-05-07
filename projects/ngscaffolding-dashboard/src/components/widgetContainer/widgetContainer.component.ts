import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ElementRef
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {
  AppSettingsService,
  AppSettingsQuery,
  ComponentLoaderService
} from 'ngscaffolding-core';
import {
  CoreMenuItem,
  WidgetDetails,
  WidgetTypes
} from '@ngscaffolding/models';
import { NgElement, WithProperties } from '@angular/elements';

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
  @Output() widgetCreated = new EventEmitter<any>();

  constructor(
    private elementRef: ElementRef,
    private componentLoader: ComponentLoaderService
  ) {}

  allowClose = false;
  allowInputs = false;
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

    if (
      this.widgetDetails.widget.inputBuilderDefinition &&
      this.widgetDetails.widget.inputBuilderDefinition.inputDetails &&
      this.widgetDetails.widget.inputBuilderDefinition.inputDetails.length > 0
    ) {
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

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['widgetDetails'].currentValue &&
      changes['widgetDetails'].currentValue
    ) {
      const widgetDetails = changes['widgetDetails'].currentValue as WidgetDetails;

      let newWidget: HTMLElement;
      let elementName = '';

      switch (widgetDetails.widget.type) {
        case WidgetTypes.GridView: {
          elementName = 'ngs-data-grid';
          break;
        }
        case WidgetTypes.Chart: {
          elementName = 'ngs-chart';
          break;
        }
        case WidgetTypes.Html: {
          elementName = 'ngs-html-container';
          break;
        }
        default: {
          elementName = widgetDetails.widget.type;
          break;
        }
      }

      this.componentLoader.loadComponent(elementName).then(element => {
        newWidget = element;
        newWidget['itemDetails'] = widgetDetails.widget.itemDetails;
          this.elementRef.nativeElement
            .querySelector('#widgetContent')
            .appendChild(newWidget);

        // Announce our new birth to the world
        this.widgetCreated.emit(newWidget);
      });

    }
  }
}
