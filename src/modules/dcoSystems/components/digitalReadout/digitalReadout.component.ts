import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from 'ngscaffolding-core';
import { IDashboardItem, WidgetDetails, ReferenceValueItem } from 'ngscaffolding-models';
const jsonQuery = require('json-query');

@Component({
  templateUrl: 'digitalReadout.component.html',
  styleUrls: ['digitalReadout.component.scss']
})
export class DigitalReadoutComponent implements IDashboardItem, OnInit, OnChanges {
  @Input() itemDetails: any;
  @Input() unitUpdate: any;
  @Input() widget: WidgetDetails;

  displayValue: string;

  widgetTitle: string;

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {});
  }

  // Expose Method in Angular Element
  // https://github.com/angular/angular/issues/22114
  @Input()
  public refreshData = () => {
    this.getData();
  }

  @Input()
  public updateData = (newData: any) => {
    this.setDisplay(newData['source'] as ReferenceValueItem);
  }

  private setDisplay(configuredValues: ReferenceValueItem) {
    this.itemDetails.jsonQuery = configuredValues.value;
    this.widgetTitle = configuredValues.display;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes.widget && changes.widget.isFirstChange && changes.widget.currentValue.configuredValues) {
      this.setDisplay(changes.widget.currentValue.configuredValues.source);
    }
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.dataSource.getDataSource({ name: this.itemDetails.dataSourceName }).subscribe(
      results => {
        if (!results.inflight && !results.error) {
          const data = JSON.parse(results.jsonData);

          this.displayValue = jsonQuery(this.itemDetails.jsonQuery, { data: data }).value;
        }
      });
  }
}
