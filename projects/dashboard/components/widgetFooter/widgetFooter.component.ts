import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ngs-widget-footer',
    templateUrl: './widgetFooter.component.html',
    styleUrls: ['./widgetFooter.component.scss']
})
export class WidgetFooterComponent implements OnChanges {
    @Input() showMoreButton: boolean;
    @Input() showMenuButton: boolean;

    @Output() moreButtonClicked = new EventEmitter<any>();
    @Output() menuButtonClicked = new EventEmitter<any>();

    ngOnChanges(changes: SimpleChanges): void {}
}
