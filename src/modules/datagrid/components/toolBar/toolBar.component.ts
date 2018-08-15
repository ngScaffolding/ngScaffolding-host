import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppSettingsService } from '../../../core/services';

@Component({
  selector: 'app-grid-toolbar',
  templateUrl: './toolBar.component.html',
  styleUrls: ['./toolBar.component.scss'],
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
export class ToolBarComponent implements OnInit {
  @Input() hideFilters: boolean;
  @Input() hideRefresh: boolean;
  @Input() hideColumns: boolean;
  @Input() hideExport: boolean;
  @Input() hideSaveView: boolean;
  @Input() hideResetView: boolean;
  @Input() hideShareView: boolean;

  @Input() hideLabels: boolean;
  @Input() collapsedToolbar: boolean;

  @Output() filtersClicked = new EventEmitter<any>();
  @Output() refreshClicked = new EventEmitter<any>();
  @Output() columnsClicked = new EventEmitter<any>();
  @Output() exportClicked = new EventEmitter<any>();
  @Output() saveViewClicked = new EventEmitter<any>();
  @Output() resetViewClicked = new EventEmitter<any>();
  @Output() shareViewClicked = new EventEmitter<any>();

  public expanded = 'false';

  constructor(public appSettingsService: AppSettingsService) {}

  public toggleMenu() {
    this.expanded = this.expanded === 'true' ? 'false' : 'true';
  }

  public buttonClicked() {
    this.expanded = 'false';
  }

  showLabel(label: string) {
    if (!this.hideLabels) {
      return label;
    } else {
      return null;
    }
  }

  ngOnInit() {}
}
