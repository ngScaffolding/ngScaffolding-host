import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IDashboardItem, WidgetModelBase, WidgetDetails } from 'ngscaffolding-models';
import { DataSourceService } from 'ngscaffolding-core';

@Component({
    templateUrl: './colourBox.component.html',
    styleUrls: ['./colourBox.component.scss']
})
export class ColourBoxComponent implements IDashboardItem, OnChanges {
    @Input() itemDetails: any;
    @Input() widgetDetails: WidgetModelBase;

    iconName = '';
    title = '';
    displayValue = '';
    classColour = 'colorbox-1';

    private inputData: {};

    constructor(private dataSource: DataSourceService) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.loadData();
    }

    @Input()
    refreshData = () => {
        this.loadData(true);
    };

    @Input()
    updateData = (newData: any) => {
        this.inputData = newData;
    };

    private loadData(forceRefresh: boolean = false) {
        this.title = this.itemDetails.title;
        this.iconName = this.widgetDetails.galleryIcon;
        if (this.widgetDetails.className) {
            this.classColour = this.widgetDetails.className;
        }

        this.dataSource
            .getDataSource({
                name: this.itemDetails.dataSourceName,
                inputData: this.inputData,
                forceRefresh: forceRefresh
            })
            .subscribe(results => {
                if (!results.error) {
                    const data = results.jsonData[0];

                    this.displayValue = data.value;
                }
            });
    }
}
