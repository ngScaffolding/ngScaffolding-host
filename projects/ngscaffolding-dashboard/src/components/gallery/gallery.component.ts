import { Component, OnInit, OnDestroy, ComponentRef, ViewChildren, QueryList, OnChanges, SimpleChanges, Input } from '@angular/core';
import { WidgetQuery, WidgetService } from 'ngscaffolding-core';
import { WidgetModelBase } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngs-gallery',
  templateUrl: 'gallery.component.html',
  styleUrls: ['gallery.component.scss']
})
export class GalleryComponent implements OnChanges {


  @Input() galleryName: string;

  widgets$: Observable<WidgetModelBase[]>;

  constructor(public widgetService: WidgetService, public widgetQuery: WidgetQuery){
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.galleryName.currentValue) {
      this.widgets$ = this.widgetQuery.selectAll({ filterBy: widget => widget.galleryName === changes.galleryName.currentValue });
    }
  }
}
