import { Component, OnInit, OnDestroy, ComponentRef, ViewChildren, QueryList, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { WidgetQuery, WidgetService } from 'ngscaffolding-core';
import { WidgetModelBase, WidgetTypes } from 'ngscaffolding-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngs-gallery',
  templateUrl: 'gallery.component.html',
  styleUrls: ['gallery.component.scss']
})
export class GalleryComponent implements OnChanges {
  @Input() galleryName: string;
  @Output() addWidget = new EventEmitter<string>();

  widgets$: Observable<WidgetModelBase[]>;

  constructor(public widgetService: WidgetService, public widgetQuery: WidgetQuery) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.galleryName.currentValue) {
      this.widgets$ = this.widgetQuery.selectAll({ filterBy: widget => widget.galleryName === changes.galleryName.currentValue });
    }
  }

  clickWidget(name: string) {
    this.addWidget.emit(name);
  }

  getIconName(widget: WidgetModelBase) {
    if (widget.galleryIcon) {
      return widget.galleryIcon;
    } else {
      switch (widget.type) {
        case WidgetTypes.Chart: {
          return 'insert_chart';
        }
        case WidgetTypes.GridView: {
          return 'grid_on';
        }
        default: {
          return 'widgets';
        }
      }
    }
  }
}
