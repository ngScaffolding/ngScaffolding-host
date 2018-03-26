import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'grid-toolbar',
  templateUrl: './toolBar.component.html',
  styleUrls: ['./toolBar.component.scss']
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

  @Output() filtersClicked = new EventEmitter<any>();
  @Output() refreshClicked = new EventEmitter<any>();
  @Output() columnsClicked = new EventEmitter<any>();
  @Output() exportClicked = new EventEmitter<any>();
  @Output() saveViewClicked = new EventEmitter<any>();
  @Output() resetViewClicked = new EventEmitter<any>();
  @Output() shareViewClicked = new EventEmitter<any>();

  constructor() {}

  showLabel(label: string) {
    if (!this.hideLabels) {
      return label;
    } else {
      return null;
    }
  }

  ngOnInit() {}
}
